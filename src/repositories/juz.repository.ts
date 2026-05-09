// src/repositories/juz.repository.ts
import { FileSystemUtil } from '@/utils/fileSystem.util';
import { LoggerUtil } from '@/utils/logger.util';
import { DATA_CONFIG } from '@/config/database.config';
import { JuzData } from '@/types/quran.types';
import path from 'path';

export class JuzRepository {
  private fileSystem: FileSystemUtil;
  private juzCache: JuzData[] | null = null;

  constructor() {
    this.fileSystem = FileSystemUtil.getInstance();
  }

  async findAll(): Promise<JuzData[]> {
    if (this.juzCache) {
      return this.juzCache;
    }

    try {
      const juzPath = path.join(DATA_CONFIG.BASE_PATH, DATA_CONFIG.JUZ_FILE);
      const juzData = await this.fileSystem.loadJSON<JuzData[]>(juzPath);
      
      this.juzCache = juzData;
      LoggerUtil.info(`Loaded ${this.juzCache.length} juz parts`);
      return this.juzCache;
    } catch (error) {
      LoggerUtil.error('Failed to load juz data', error as Error);
      return [];
    }
  }

  async findById(juzNumber: number): Promise<JuzData | null> {
    const allJuz = await this.findAll();
    const juzIndex = juzNumber.toString().padStart(2, '0');
    return allJuz.find(j => j.index === juzIndex) || null;
  }

  clearCache(): void {
    this.juzCache = null;
    LoggerUtil.info('Juz repository cache cleared');
  }
}