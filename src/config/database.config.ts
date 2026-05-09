// src/config/database.config.ts
import path from 'path';

export const DATA_CONFIG = {
  BASE_PATH: process.env.DATA_PATH || './src/data/quran-dataset',
  
  SURAH_INDEX_FILE: path.join('source', 'surah.json'),
  JUZ_FILE: path.join('source', 'juz.json'),
  
  SURAH_DIR: path.join('source', 'surah'),
  TAJWEED_DIR: path.join('source', 'tajweed'),
  TRANSLATION_DIR: path.join('source', 'translation'),
  AUDIO_DIR: path.join('source', 'audio'),
  
  getSurahFile: (surahNumber: number): string => 
    path.join('source', 'surah', `surah_${surahNumber}.json`),
  
  getTajweedFile: (surahNumber: number): string => 
    path.join('source', 'tajweed', `surah_${surahNumber}.json`),
  
  getTranslationFile: (surahNumber: number, language: string): string => 
    path.join('source', 'translation', language, `${language}_translation_${surahNumber}.json`),
  
  getAudioFile: (surahNumber: number, ayahNumber: number): string => {
    const surahPadded = surahNumber.toString().padStart(3, '0');
    const ayahPadded = ayahNumber.toString().padStart(3, '0');
    return path.join('source', 'audio', surahPadded, `${ayahPadded}.mp3`);
  },
  
  getAudioIndexFile: (surahNumber: number): string => {
    const surahPadded = surahNumber.toString().padStart(3, '0');
    return path.join('source', 'audio', surahPadded, 'index.json');
  },
} as const;