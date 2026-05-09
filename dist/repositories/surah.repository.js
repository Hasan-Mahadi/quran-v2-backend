"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/repositories/surah.repository.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurahRepository = void 0;
const path_1 = __importDefault(require("path"));
const fileSystem_util_1 = require("../utils/fileSystem.util");
const database_config_1 = require("../config/database.config");
const logger_util_1 = require("../utils/logger.util");
const error_util_1 = require("../utils/error.util");
class SurahRepository {
    fileSystem;
    surahsCache = new Map();
    indexCache = null;
    constructor() {
        this.fileSystem = fileSystem_util_1.FileSystemUtil.getInstance();
    }
    async findAll() {
        if (this.indexCache) {
            return this.indexCache;
        }
        try {
            const indexPath = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, database_config_1.DATA_CONFIG.SURAH_INDEX_FILE);
            const surahIndex = await this.fileSystem.loadJSON(indexPath);
            this.indexCache = surahIndex;
            logger_util_1.LoggerUtil.info(`Loaded ${this.indexCache.length} surahs from index`);
            return this.indexCache;
        }
        catch (error) {
            logger_util_1.LoggerUtil.error('Failed to load surah index', error);
            throw error;
        }
    }
    async findById(id) {
        if (this.surahsCache.has(id)) {
            return this.surahsCache.get(id);
        }
        try {
            const surahPath = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, database_config_1.DATA_CONFIG.getSurahFile(id));
            const surahData = await this.fileSystem.loadJSON(surahPath);
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
        }
        catch (error) {
            logger_util_1.LoggerUtil.error(`Failed to load surah ${id}`, error);
            throw new error_util_1.NotFoundError(`Surah ${id}`);
        }
    }
    convertVersesToAyahs(verse, count) {
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
    async getSurahInfo(id) {
        const surahIndex = await this.findAll();
        const surahInfo = surahIndex.find(s => parseInt(s.index) === id);
        if (!surahInfo) {
            throw new error_util_1.NotFoundError(`Surah ${id}`);
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
    async exists(id) {
        try {
            await this.findById(id);
            return true;
        }
        catch {
            return false;
        }
    }
    clearCache() {
        this.surahsCache.clear();
        this.indexCache = null;
        logger_util_1.LoggerUtil.info('Surah repository cache cleared');
    }
}
exports.SurahRepository = SurahRepository;
