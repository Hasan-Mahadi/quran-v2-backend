/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
// src/repositories/audio.repository.ts

import path from 'path';
import fs from 'fs';
import { FileSystemUtil } from '../utils/fileSystem.util';
import { DATA_CONFIG } from '../config/database.config';
import { LoggerUtil } from '../utils/logger.util';
import { NotFoundError } from '../utils/error.util';

export interface AudioInfo {
  surahId: number;
  ayahNumber: number;
  exists: boolean;
  fileSize?: number;
  format?: string;
}

export interface AudioIndex {
  [ayahNumber: string]: {
    filename: string;
    duration?: number;
    size?: number;
  };
}

export class AudioRepository {
  private fileSystem: FileSystemUtil;
  private audioCache: Map<string, boolean> = new Map();
  private audioIndexCache: Map<number, AudioIndex> = new Map();

  constructor() {
    this.fileSystem = FileSystemUtil.getInstance();
  }

  async getAudioIndex(surahId: number): Promise<AudioIndex | null> {
    if (this.audioIndexCache.has(surahId)) {
      return this.audioIndexCache.get(surahId)!;
    }

    try {
      const indexPath = path.join(
        DATA_CONFIG.BASE_PATH,
        DATA_CONFIG.getAudioIndexFile(surahId)
      );
      
      const exists = await this.fileSystem.fileExists(indexPath);
      
      if (!exists) {
        LoggerUtil.warn(`Audio index not found for surah ${surahId}`);
        return null;
      }

      const audioIndex = await this.fileSystem.loadJSON<AudioIndex>(indexPath);
      this.audioIndexCache.set(surahId, audioIndex);
      return audioIndex;
    } catch (error) {
      LoggerUtil.error(`Failed to load audio index for surah ${surahId}`, error as Error);
      return null;
    }
  }

  async audioExists(surahId: number, ayahNumber: number): Promise<boolean> {
    const cacheKey = `${surahId}_${ayahNumber}`;

    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    // Try both naming conventions: with and without leading zeros
    const audioPath1 = path.join(
      DATA_CONFIG.BASE_PATH,
      DATA_CONFIG.getAudioFile(surahId, ayahNumber)
    );
    
    // For files named like 001.mp3 (with leading zeros)
    const ayahPadded = ayahNumber.toString().padStart(3, '0');
    const audioPath2 = path.join(
      DATA_CONFIG.BASE_PATH,
      `source/audio/${surahId.toString().padStart(3, '0')}/${ayahPadded}.mp3`
    );
    
    let exists = await this.fileSystem.fileExists(audioPath1);
    if (!exists) {
      exists = await this.fileSystem.fileExists(audioPath2);
    }
    
    this.audioCache.set(cacheKey, exists);
    return exists;
  }

  async getAudioInfo(surahId: number, ayahNumber: number): Promise<AudioInfo> {
    const exists = await this.audioExists(surahId, ayahNumber);
    
    if (!exists) {
      return {
        surahId,
        ayahNumber,
        exists: false,
      };
    }

    // Try to get additional info from index
    const audioIndex = await this.getAudioIndex(surahId);
    const ayahPadded = ayahNumber.toString().padStart(3, '0');
    const indexInfo = audioIndex?.[ayahNumber] || audioIndex?.[ayahPadded];
    
    let fileSize: number | undefined;
    
    if (indexInfo?.size) {
      fileSize = indexInfo.size;
    } else {
      // Fallback to stat the file
      const surahPadded = surahId.toString().padStart(3, '0');
      const audioPath = path.join(
        DATA_CONFIG.BASE_PATH,
        `source/audio/${surahPadded}/${ayahPadded}.mp3`
      );
      try {
        const stats = await fs.promises.stat(audioPath);
        fileSize = stats.size;
      } catch (error) {
        // Ignore stat errors
      }
    }
    
    return {
      surahId,
      ayahNumber,
      exists: true,
      fileSize,
      format: 'audio/mpeg',
    };
  }

  async getAudioStream(surahId: number, ayahNumber: number): Promise<Buffer> {
    const surahPadded = surahId.toString().padStart(3, '0');
    const ayahPadded = ayahNumber.toString().padStart(3, '0');
    const audioPath = path.join(
      DATA_CONFIG.BASE_PATH,
      `source/audio/${surahPadded}/${ayahPadded}.mp3`
    );
    
    if (!(await this.audioExists(surahId, ayahNumber))) {
      throw new NotFoundError(`Audio for surah ${surahId}, ayah ${ayahNumber}`);
    }

    try {
      const audioData = await fs.promises.readFile(audioPath);
      return audioData;
    } catch (error) {
      LoggerUtil.error(`Failed to load audio for surah ${surahId}, ayah ${ayahNumber}`, error as Error);
      throw new NotFoundError(`Audio file not found or corrupted`);
    }
  }

  async getAvailableAyahs(surahId: number): Promise<number[]> {
    const surahPadded = surahId.toString().padStart(3, '0');
    const audioDir = path.join(DATA_CONFIG.BASE_PATH, `source/audio/${surahPadded}`);
    
    try {
      const files = await fs.promises.readdir(audioDir);
      const mp3Files = files.filter(f => f.endsWith('.mp3'));
      const ayahNumbers = mp3Files.map(f => parseInt(f.replace('.mp3', ''))).filter(n => !isNaN(n));
      return ayahNumbers.sort((a, b) => a - b);
    } catch (error) {
      LoggerUtil.warn(`Failed to read audio directory for surah ${surahId}`, );
      return [];
    }
  }

  clearCache(): void {
    this.audioCache.clear();
    this.audioIndexCache.clear();
    LoggerUtil.info('Audio repository cache cleared');
  }
}