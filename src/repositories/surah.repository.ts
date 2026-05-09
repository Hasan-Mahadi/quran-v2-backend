/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/repositories/surah.repository.ts

import path from 'path';
import { FileSystemUtil } from '../utils/fileSystem.util';
import { DATA_CONFIG } from '../config/database.config';
import { LoggerUtil } from '../utils/logger.util';
import { NotFoundError } from '../utils/error.util';

export interface SurahIndexItem {
  place: string;
  type: string;
  count: number;
  title: string;
  titleAr: string;
  index: string;
  pages: string;
  juz: Array<{
    index: string;
    verse: {
      start: string;
      end: string;
    };
  }>;
}

export class SurahRepository {
  private fileSystem: FileSystemUtil;
  private surahsCache: Map<number, any> = new Map();
  private indexCache: SurahIndexItem[] | null = null;

  constructor() {
    this.fileSystem = FileSystemUtil.getInstance();
  }

  async findAll(): Promise<SurahIndexItem[]> {
    if (this.indexCache) {
      return this.indexCache;
    }

    try {
      const indexPath = path.join(DATA_CONFIG.BASE_PATH, DATA_CONFIG.SURAH_INDEX_FILE);
      const surahIndex = await this.fileSystem.loadJSON<SurahIndexItem[]>(indexPath);

      this.indexCache = surahIndex;
      LoggerUtil.info(`Loaded ${this.indexCache.length} surahs from index`);
      return this.indexCache;
    } catch (error) {
      LoggerUtil.error('Failed to load surah index', error as Error);
      throw error;
    }
  }

  async findById(id: number): Promise<any> {
    if (this.surahsCache.has(id)) {
      return this.surahsCache.get(id)!;
    }

    try {
      const surahPath = path.join(DATA_CONFIG.BASE_PATH, DATA_CONFIG.getSurahFile(id));
      const surahData = await this.fileSystem.loadJSON<any>(surahPath);
      
      // Transform your data structure to a consistent format
      const normalizedData = {
        number: parseInt(surahData.index),
        name: surahData.name,
        nameArabic: surahData.name,
        englishName: surahData.name,
        numberOfAyahs: surahData.count,
        revelationType: 'Meccan', // Default, will be updated from index
        ayahs: this.convertVersesToAyahs(surahData.verse, surahData.count),
      };

      this.surahsCache.set(id, normalizedData);
      return normalizedData;
    } catch (error) {
      LoggerUtil.error(`Failed to load surah ${id}`, error as Error);
      throw new NotFoundError(`Surah ${id}`);
    }
  }

  private convertVersesToAyahs(verse: any, count: number): any[] {
    const ayahs = [];
    
    for (let i = 1; i <= count; i++) {
      const verseKey = `verse_${i}`;
      const verseText = verse[verseKey];
      
      if (verseText) {
        ayahs.push({
          number: i,
          numberInSurah: i,
          text: verseText,
          juz: 0,
          manzil: 0,
          page: 0,
          ruku: 0,
          hizbQuarter: 0,
          sajda: false,
        });
      }
    }
    
    return ayahs;
  }

  async getSurahInfo(id: number): Promise<any> {
    const surahIndex = await this.findAll();
    const surahInfo = surahIndex.find(s => parseInt(s.index) === id);
    
    if (!surahInfo) {
      throw new NotFoundError(`Surah ${id}`);
    }

    return {
      id: parseInt(surahInfo.index),
      name: surahInfo.title,
      nameArabic: surahInfo.titleAr,
      nameEnglish: surahInfo.title,
      ayahCount: surahInfo.count,
      revelationType: surahInfo.type === 'Makkiyah' ? 'Meccan' : 'Medinan',
    };
  }

  async exists(id: number): Promise<boolean> {
    try {
      await this.findById(id);
      return true;
    } catch {
      return false;
    }
  }

  clearCache(): void {
    this.surahsCache.clear();
    this.indexCache = null;
    LoggerUtil.info('Surah repository cache cleared');
  }
}