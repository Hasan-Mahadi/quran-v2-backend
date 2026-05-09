/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/repositories/translation.repository.ts
import { FileSystemUtil } from '@/utils/fileSystem.util';
import { LoggerUtil } from '@/utils/logger.util';
import { DATA_CONFIG } from '@/config/database.config';
import { SupportedLanguage } from '@/types/quran.types';
import path from 'path';

export class TranslationRepository {
  private fileSystem: FileSystemUtil;
  private translationCache: Map<string, Map<number, string>> = new Map();

  constructor() {
    this.fileSystem = FileSystemUtil.getInstance();
  }

  private getCacheKey(surahId: number, language: string): string {
    return `${language}_${surahId}`;
  }

  async getTranslation(
    surahId: number,
    ayahNumber: number,
    language: SupportedLanguage
  ): Promise<string | null> {
    const cacheKey = this.getCacheKey(surahId, language);

    if (!this.translationCache.has(cacheKey)) {
      await this.loadSurahTranslations(surahId, language);
    }

    const surahTranslations = this.translationCache.get(cacheKey);
    return surahTranslations?.get(ayahNumber) || null;
  }

  async getSurahTranslations(
    surahId: number,
    language: SupportedLanguage
  ): Promise<Map<number, string>> {
    const cacheKey = this.getCacheKey(surahId, language);

    if (!this.translationCache.has(cacheKey)) {
      await this.loadSurahTranslations(surahId, language);
    }

    return this.translationCache.get(cacheKey) || new Map();
  }

  private async loadSurahTranslations(surahId: number, language: string): Promise<void> {
    try {
      const translationPath = path.join(
        DATA_CONFIG.BASE_PATH,
        DATA_CONFIG.getTranslationFile(surahId, language)
      );
      
      const exists = await this.fileSystem.fileExists(translationPath);
      
      if (!exists) {
        LoggerUtil.warn(`Translation not found for surah ${surahId} in ${language}`);
        this.translationCache.set(this.getCacheKey(surahId, language), new Map());
        return;
      }

      const translationData = await this.fileSystem.loadJSON<any>(translationPath);
      const translationMap = new Map<number, string>();

      // Handle your actual translation structure with 'verse' object
      if (translationData.verse) {
        // Format: { verse: { verse_1: "text", verse_2: "text", ... } }
        for (let i = 1; i <= (translationData.count || 100); i++) {
          const verseKey = `verse_${i}`;
          const translation = translationData.verse[verseKey];
          if (translation) {
            translationMap.set(i, translation);
          }
        }
      } else if (Array.isArray(translationData)) {
        // Format: [{ ayah: 1, translation: "text" }, ...]
        translationData.forEach((item: any) => {
          const ayahNumber = item.ayah || item.ayahNumber || item.number;
          const text = item.translation || item.text || item.content;
          if (ayahNumber && text) {
            translationMap.set(ayahNumber, text);
          }
        });
      } else if (typeof translationData === 'object') {
        // Format: { "1": "text", "2": "text" }
        for (const [key, value] of Object.entries(translationData)) {
          const ayahNumber = parseInt(key);
          if (!isNaN(ayahNumber) && value) {
            translationMap.set(ayahNumber, value as string);
          }
        }
      }

      this.translationCache.set(this.getCacheKey(surahId, language), translationMap);
      LoggerUtil.debug(`Loaded ${translationMap.size} translations for surah ${surahId} in ${language}`);
    } catch (error) {
      LoggerUtil.error(`Failed to load translations for surah ${surahId}`, error as Error);
      this.translationCache.set(this.getCacheKey(surahId, language), new Map());
    }
  }

  async getAvailableLanguages(surahId: number): Promise<string[]> {
    const commonLanguages = ['en', 'id', 'ar'];
    const available: string[] = [];

    for (const lang of commonLanguages) {
      const translationPath = path.join(
        DATA_CONFIG.BASE_PATH,
        DATA_CONFIG.getTranslationFile(surahId, lang)
      );
      if (await this.fileSystem.fileExists(translationPath)) {
        available.push(lang);
      }
    }

    return available;
  }

  clearCache(): void {
    this.translationCache.clear();
    LoggerUtil.info('Translation repository cache cleared');
  }
}