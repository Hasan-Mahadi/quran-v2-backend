"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/repositories/translation.repository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationRepository = void 0;
const path_1 = __importDefault(require("path"));
const fileSystem_util_1 = require("../utils/fileSystem.util");
const database_config_1 = require("../config/database.config");
const logger_util_1 = require("../utils/logger.util");
class TranslationRepository {
    fileSystem;
    translationCache = new Map();
    constructor() {
        this.fileSystem = fileSystem_util_1.FileSystemUtil.getInstance();
    }
    getCacheKey(surahId, language) {
        return `${language}_${surahId}`;
    }
    async getTranslation(surahId, ayahNumber, language) {
        const cacheKey = this.getCacheKey(surahId, language);
        if (!this.translationCache.has(cacheKey)) {
            await this.loadSurahTranslations(surahId, language);
        }
        const surahTranslations = this.translationCache.get(cacheKey);
        return surahTranslations?.get(ayahNumber) || null;
    }
    async getSurahTranslations(surahId, language) {
        const cacheKey = this.getCacheKey(surahId, language);
        if (!this.translationCache.has(cacheKey)) {
            await this.loadSurahTranslations(surahId, language);
        }
        return this.translationCache.get(cacheKey) || new Map();
    }
    async loadSurahTranslations(surahId, language) {
        try {
            const translationPath = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, database_config_1.DATA_CONFIG.getTranslationFile(surahId, language));
            const exists = await this.fileSystem.fileExists(translationPath);
            if (!exists) {
                logger_util_1.LoggerUtil.warn(`Translation not found for surah ${surahId} in ${language}`);
                this.translationCache.set(this.getCacheKey(surahId, language), new Map());
                return;
            }
            const translationData = await this.fileSystem.loadJSON(translationPath);
            const translationMap = new Map();
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
            }
            else if (Array.isArray(translationData)) {
                // Format: [{ ayah: 1, translation: "text" }, ...]
                translationData.forEach((item) => {
                    const ayahNumber = item.ayah || item.ayahNumber || item.number;
                    const text = item.translation || item.text || item.content;
                    if (ayahNumber && text) {
                        translationMap.set(ayahNumber, text);
                    }
                });
            }
            else if (typeof translationData === 'object') {
                // Format: { "1": "text", "2": "text" }
                for (const [key, value] of Object.entries(translationData)) {
                    const ayahNumber = parseInt(key);
                    if (!isNaN(ayahNumber) && value) {
                        translationMap.set(ayahNumber, value);
                    }
                }
            }
            this.translationCache.set(this.getCacheKey(surahId, language), translationMap);
            logger_util_1.LoggerUtil.debug(`Loaded ${translationMap.size} translations for surah ${surahId} in ${language}`);
        }
        catch (error) {
            logger_util_1.LoggerUtil.error(`Failed to load translations for surah ${surahId}`, error);
            this.translationCache.set(this.getCacheKey(surahId, language), new Map());
        }
    }
    async getAvailableLanguages(surahId) {
        const commonLanguages = ['en', 'id', 'ar'];
        const available = [];
        for (const lang of commonLanguages) {
            const translationPath = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, database_config_1.DATA_CONFIG.getTranslationFile(surahId, lang));
            if (await this.fileSystem.fileExists(translationPath)) {
                available.push(lang);
            }
        }
        return available;
    }
    clearCache() {
        this.translationCache.clear();
        logger_util_1.LoggerUtil.info('Translation repository cache cleared');
    }
}
exports.TranslationRepository = TranslationRepository;
