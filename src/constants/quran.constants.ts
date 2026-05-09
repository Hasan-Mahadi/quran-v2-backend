 

export const QURAN_CONSTANTS = {
  TOTAL_SURAHS: 114,
  TOTAL_JUZ: 30,
  TOTAL_MANZIL: 7,
  SUPPORTED_LANGUAGES: ['en', 'id', 'ar'] as const,
  DEFAULT_TRANSLATION: 'en',
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
    MAX_QUERY_LENGTH: 100,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    CACHE_TTL: 3600,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
} as const;

export type SupportedLanguage = typeof QURAN_CONSTANTS.SUPPORTED_LANGUAGES[number];