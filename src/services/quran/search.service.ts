/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/services/quran/search.service.ts






import { SurahRepository } from '../../repositories/surah.repository';
import { QURAN_CONSTANTS, SupportedLanguage } from '../../constants/quran.constants';
import { LoggerUtil } from '../../utils/logger.util';
import { TranslationRepository } from '../../repositories/translation.repository';
import { SearchResult } from '../../types/quran.types';
import { ValidationError } from '../../utils/error.util';

interface SearchIndexEntry {
  surahId: number;
  ayahNumber: number;
  text: string;
}

interface SearchIndex {
  [key: string]: SearchIndexEntry[];
}

export class SearchService {
  private surahRepository: SurahRepository;
  private translationRepository: TranslationRepository;
  private arabicIndex: SearchIndex = {};
  private translationIndex: Map<string, SearchIndex> = new Map();
  private isIndexed: boolean = false;

  constructor() {
    this.surahRepository = new SurahRepository();
    this.translationRepository = new TranslationRepository();
  }

  async initializeSearchIndex(): Promise<void> {
    if (this.isIndexed) return;

    LoggerUtil.info('Initializing search index...');
    
    await this.indexArabicText();
    
    for (const lang of QURAN_CONSTANTS.SUPPORTED_LANGUAGES) {
      await this.indexTranslations(lang as SupportedLanguage);
    }

    this.isIndexed = true;
    LoggerUtil.info('Search index initialization completed');
  }

  private async indexArabicText(): Promise<void> {
    const surahs = await this.surahRepository.findAll();
    
    for (const surah of surahs) {
      const surahId = parseInt(surah.index);
      const surahData = await this.surahRepository.findById(surahId);
      
      let ayahs = surahData.ayahs || surahData.verses || [];
      
      if (ayahs.length === 0 && surahData.data) {
        ayahs = surahData.data;
      }
      
      for (const ayah of ayahs) {
        const ayahNumber = ayah.number || ayah.numberInSurah || ayah.index;
        const ayahText = ayah.text || ayah.arabicText || ayah.content;
        
        if (ayahText) {
          this.addToIndex(this.arabicIndex, ayahText, surahId, parseInt(ayahNumber));
        }
      }
      
      LoggerUtil.debug(`Indexed surah ${surahId} with ${ayahs.length} ayahs`);
    }
  }

  private async indexTranslations(language: SupportedLanguage): Promise<void> {
    const translationIndex: SearchIndex = {};
    const surahs = await this.surahRepository.findAll();

    for (const surah of surahs) {
      const surahId = parseInt(surah.index);
      const translations = await this.translationRepository.getSurahTranslations(surahId, language);
      
      for (const [ayahNumber, translation] of translations) {
        if (translation) {
          this.addToIndex(translationIndex, translation, surahId, ayahNumber);
        }
      }
    }

    this.translationIndex.set(language, translationIndex);
    LoggerUtil.debug(`Indexed translations for ${language}`);
  }

  private addToIndex(index: SearchIndex, text: string, surahId: number, ayahNumber: number): void {
    const words = this.tokenize(text);
    
    for (const word of words) {
      if (!index[word]) {
        index[word] = [];
      }
      index[word].push({ surahId, ayahNumber, text });
    }
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s\u0600-\u06FF]/g, '')
      .split(/\s+/)
      .filter(word => word.length >= QURAN_CONSTANTS.SEARCH.MIN_QUERY_LENGTH);
  }

  async search(
    query: string,
    type: 'arabic' | 'translation' = 'arabic',
    language?: SupportedLanguage,
    page: number = 1,
    limit: number = QURAN_CONSTANTS.SEARCH.DEFAULT_PAGE_SIZE
  ): Promise<{ results: SearchResult[]; total: number }> {
    if (!query || query.length < QURAN_CONSTANTS.SEARCH.MIN_QUERY_LENGTH) {
      throw new ValidationError(
        `Search query must be at least ${QURAN_CONSTANTS.SEARCH.MIN_QUERY_LENGTH} characters`
      );
    }

    if (!this.isIndexed) {
      await this.initializeSearchIndex();
    }

    let searchResults: SearchIndexEntry[] = [];
    let usedIndex: SearchIndex;

    if (type === 'arabic') {
      usedIndex = this.arabicIndex;
    } else {
      if (!language) {
        language = QURAN_CONSTANTS.DEFAULT_TRANSLATION as SupportedLanguage;
      }
      usedIndex = this.translationIndex.get(language) || {};
    }

    const searchTerms = this.tokenize(query);
    const termResults = searchTerms.map(term => usedIndex[term] || []);
    
    if (termResults.length > 0) {
      searchResults = this.intersectResults(termResults);
    }

    const scoredResults = await this.calculateRelevanceScores(searchResults, query);
    scoredResults.sort((a, b) => b.matchScore - a.matchScore);
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedResults = scoredResults.slice(start, end);
    const enrichedResults = await this.enrichResults(paginatedResults);

    return {
      results: enrichedResults,
      total: scoredResults.length,
    };
  }

  private intersectResults(
    resultsArrays: SearchIndexEntry[][]
  ): SearchIndexEntry[] {
    if (resultsArrays.length === 0) return [];
    
    const firstArray = resultsArrays[0];
    const otherArrays = resultsArrays.slice(1);
    
    return firstArray.filter(item =>
      otherArrays.every(arr =>
        arr.some(
          otherItem =>
            otherItem.surahId === item.surahId && otherItem.ayahNumber === item.ayahNumber
        )
      )
    );
  }

  private async calculateRelevanceScores(
    results: SearchIndexEntry[],
    query: string
  ): Promise<(SearchResult & { matchScore: number })[]> {
    const normalizedQuery = query.toLowerCase();
    
    return results.map(result => {
      let score = 0;
      const normalizedText = result.text.toLowerCase();
      
      if (normalizedText.includes(normalizedQuery)) {
        score += 10;
      }
      
      const queryWords = normalizedQuery.split(/\s+/);
      for (const word of queryWords) {
        if (normalizedText.includes(word)) {
          score += 1;
        }
      }
      
      score += (100 / normalizedText.length);
      
      return {
        surahId: result.surahId,
        ayahNumber: result.ayahNumber,
        arabicText: result.text,
        matchScore: score,
      };
    });
  }

  private async enrichResults(
    results: Array<{ surahId: number; ayahNumber: number; arabicText: string; matchScore: number }>
  ): Promise<SearchResult[]> {
    const enriched: SearchResult[] = [];
    
    for (const result of results) {
      const surahInfo = await this.surahRepository.getSurahInfo(result.surahId);
      
      enriched.push({
        surahId: result.surahId,
        surahName: surahInfo.nameEnglish,
        ayahNumber: result.ayahNumber,
        arabicText: result.arabicText,
        matchScore: result.matchScore,
      });
    }
    
    return enriched;
  }

  getSearchStats(): any {
    return {
      isIndexed: this.isIndexed,
      arabicIndexSize: Object.keys(this.arabicIndex).length,
      translationIndexSizes: Array.from(this.translationIndex.entries()).map(([lang, index]) => ({
        language: lang,
        termsCount: Object.keys(index).length,
      })),
    };
  }
}