"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/services/quran/search.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const surah_repository_1 = require("../../repositories/surah.repository");
const quran_constants_1 = require("../../constants/quran.constants");
const logger_util_1 = require("../../utils/logger.util");
const translation_repository_1 = require("../../repositories/translation.repository");
const error_util_1 = require("../../utils/error.util");
class SearchService {
    surahRepository;
    translationRepository;
    arabicIndex = {};
    translationIndex = new Map();
    isIndexed = false;
    constructor() {
        this.surahRepository = new surah_repository_1.SurahRepository();
        this.translationRepository = new translation_repository_1.TranslationRepository();
    }
    async initializeSearchIndex() {
        if (this.isIndexed)
            return;
        logger_util_1.LoggerUtil.info('Initializing search index...');
        await this.indexArabicText();
        for (const lang of quran_constants_1.QURAN_CONSTANTS.SUPPORTED_LANGUAGES) {
            await this.indexTranslations(lang);
        }
        this.isIndexed = true;
        logger_util_1.LoggerUtil.info('Search index initialization completed');
    }
    async indexArabicText() {
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
            logger_util_1.LoggerUtil.debug(`Indexed surah ${surahId} with ${ayahs.length} ayahs`);
        }
    }
    async indexTranslations(language) {
        const translationIndex = {};
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
        logger_util_1.LoggerUtil.debug(`Indexed translations for ${language}`);
    }
    addToIndex(index, text, surahId, ayahNumber) {
        const words = this.tokenize(text);
        for (const word of words) {
            if (!index[word]) {
                index[word] = [];
            }
            index[word].push({ surahId, ayahNumber, text });
        }
    }
    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s\u0600-\u06FF]/g, '')
            .split(/\s+/)
            .filter(word => word.length >= quran_constants_1.QURAN_CONSTANTS.SEARCH.MIN_QUERY_LENGTH);
    }
    async search(query, type = 'arabic', language, page = 1, limit = quran_constants_1.QURAN_CONSTANTS.SEARCH.DEFAULT_PAGE_SIZE) {
        if (!query || query.length < quran_constants_1.QURAN_CONSTANTS.SEARCH.MIN_QUERY_LENGTH) {
            throw new error_util_1.ValidationError(`Search query must be at least ${quran_constants_1.QURAN_CONSTANTS.SEARCH.MIN_QUERY_LENGTH} characters`);
        }
        if (!this.isIndexed) {
            await this.initializeSearchIndex();
        }
        let searchResults = [];
        let usedIndex;
        if (type === 'arabic') {
            usedIndex = this.arabicIndex;
        }
        else {
            if (!language) {
                language = quran_constants_1.QURAN_CONSTANTS.DEFAULT_TRANSLATION;
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
    intersectResults(resultsArrays) {
        if (resultsArrays.length === 0)
            return [];
        const firstArray = resultsArrays[0];
        const otherArrays = resultsArrays.slice(1);
        return firstArray.filter(item => otherArrays.every(arr => arr.some(otherItem => otherItem.surahId === item.surahId && otherItem.ayahNumber === item.ayahNumber)));
    }
    async calculateRelevanceScores(results, query) {
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
    async enrichResults(results) {
        const enriched = [];
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
    getSearchStats() {
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
exports.SearchService = SearchService;
