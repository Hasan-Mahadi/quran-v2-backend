/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/quran/surah.service.ts
import { SurahRepository } from '@/repositories/surah.repository';
import { TranslationRepository } from '@/repositories/translation.repository';
import { SupportedLanguage } from '@/types/quran.types';
import { ValidationError } from '@/utils/error.util';
import { QURAN_CONSTANTS } from '@/constants/quran.constants';

export class SurahService {
  private surahRepository: SurahRepository;
  private translationRepository: TranslationRepository;

  constructor() {
    this.surahRepository = new SurahRepository();
    this.translationRepository = new TranslationRepository();
  }

  async getAllSurahs(): Promise<any[]> {
    const surahs = await this.surahRepository.findAll();
    return surahs.map(surah => ({
      id: parseInt(surah.index),
      name: surah.title,
      nameArabic: surah.titleAr,
      nameEnglish: surah.title,
      ayahCount: surah.count,
      revelationType: surah.type === 'Makkiyah' ? 'Meccan' : 'Medinan',
    }));
  }

  async getSurahById(
    id: number,
    language: SupportedLanguage = QURAN_CONSTANTS.DEFAULT_TRANSLATION as SupportedLanguage
  ): Promise<any> {
    this.validateSurahId(id);

    const surahInfo = await this.surahRepository.getSurahInfo(id);
    const surahData = await this.surahRepository.findById(id);
    const translations = await this.translationRepository.getSurahTranslations(id, language);

    // Handle different ayah structures
    let ayahs = surahData.ayahs || surahData.verses || [];
    
    const transformedAyahs = ayahs.map((ayah: any, index: number) => {
      const ayahNumber = ayah.number || ayah.numberInSurah || (index + 1);
      return {
        surahId: id,
        ayahNumber: ayahNumber,
        ayahNumberInSurah: ayahNumber,
        arabicText: ayah.text || ayah.arabicText || ayah.content,
        translation: translations.get(ayahNumber) || null,
        juz: ayah.juz || 0,
        page: ayah.page || 0,
        manzil: ayah.manzil || 0,
        ruku: ayah.ruku || 0,
        hizbQuarter: ayah.hizbQuarter || 0,
        sajda: ayah.sajda || false,
      };
    });

    return {
      id: id,
      name: surahInfo.name,
      nameArabic: surahInfo.nameArabic,
      nameEnglish: surahInfo.nameEnglish,
      revelationType: surahInfo.revelationType,
      ayahCount: surahInfo.ayahCount,
      ayahs: transformedAyahs,
    };
  }

  async getSurahAyahs(
    surahId: number,
    fromAyah?: number,
    toAyah?: number,
    language: SupportedLanguage = QURAN_CONSTANTS.DEFAULT_TRANSLATION as SupportedLanguage
  ): Promise<any[]> {
    const surah = await this.getSurahById(surahId, language);
    
    let ayahs = surah.ayahs;
    
    if (fromAyah || toAyah) {
      const start = fromAyah || 1;
      const end = toAyah || surah.ayahCount;
      this.validateAyahRange(start, end, surah.ayahCount);
      ayahs = ayahs.filter((ayah: any) => ayah.ayahNumberInSurah >= start && ayah.ayahNumberInSurah <= end);
    }
    
    return ayahs;
  }

  async getSurahInfo(id: number): Promise<any> {
    this.validateSurahId(id);
    return await this.surahRepository.getSurahInfo(id);
  }

  private validateSurahId(id: number): void {
    if (id < 1 || id > QURAN_CONSTANTS.TOTAL_SURAHS) {
      throw new ValidationError(`Surah ID must be between 1 and ${QURAN_CONSTANTS.TOTAL_SURAHS}`);
    }
  }

  private validateAyahRange(start: number, end: number, totalAyahs: number): void {
    if (start < 1 || end > totalAyahs || start > end) {
      throw new ValidationError(
        `Invalid ayah range. Must be between 1 and ${totalAyahs}, and start must be <= end`
      );
    }
  }
}