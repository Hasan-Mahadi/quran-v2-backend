// src/types/quran.types.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SurahIndexItem {
  place: string;
  type: string;
  count: number;
  title: string;
  titleAr: string;
  index: string;  // Note: This is a string "001", not a number
  pages: string;
  juz: Array<{
    index: string;
    verse: {
      start: string;
      end: string;
    };
  }>;
}

export interface RawSurahData {
  // Your surah JSON structure
  number?: number;
  index?: string;
  name?: string;
  englishName?: string;
  englishNameTranslation?: string;
  numberOfAyahs?: number;
  revelationType?: string;
  ayahs?: RawAyah[];
  // Alternative structure from your data
  verses?: any[];
}

export interface RawAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  nameEnglish: string;
  nameTranslation: string;
  ayahCount: number;
  revelationType: string;
}

export interface Ayah {
  surahId: number;
  ayahNumber: number;
  ayahNumberInSurah: number;
  arabicText: string;
  translation?: string | null;
  juz: number;
  page: number;
  manzil: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface JuzData {
  index: string;
  start: {
    index: string;
    verse: string;
    name: string;
  };
  end: {
    index: string;
    verse: string;
    name: string;
  };
}

export interface SearchResult {
  surahId: number;
  surahName?: string;  // Make optional since we add it in enrichment
  ayahNumber: number;
  arabicText: string;
  translation?: string;
  matchScore: number;
}

export type SupportedLanguage = 'en' | 'id' | 'ar';