"use strict";
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/quran/surah.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurahService = void 0;
const quran_constants_1 = require("../../constants/quran.constants");
const surah_repository_1 = require("../../repositories/surah.repository");
const translation_repository_1 = require("../../repositories/translation.repository");
const error_util_1 = require("../../utils/error.util");
class SurahService {
    surahRepository;
    translationRepository;
    constructor() {
        this.surahRepository = new surah_repository_1.SurahRepository();
        this.translationRepository = new translation_repository_1.TranslationRepository();
    }
    async getAllSurahs() {
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
    async getSurahById(id, language = quran_constants_1.QURAN_CONSTANTS.DEFAULT_TRANSLATION) {
        this.validateSurahId(id);
        const surahInfo = await this.surahRepository.getSurahInfo(id);
        const surahData = await this.surahRepository.findById(id);
        const translations = await this.translationRepository.getSurahTranslations(id, language);
        // Handle different ayah structures
        let ayahs = surahData.ayahs || surahData.verses || [];
        const transformedAyahs = ayahs.map((ayah, index) => {
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
    async getSurahAyahs(surahId, fromAyah, toAyah, language = quran_constants_1.QURAN_CONSTANTS.DEFAULT_TRANSLATION) {
        const surah = await this.getSurahById(surahId, language);
        let ayahs = surah.ayahs;
        if (fromAyah || toAyah) {
            const start = fromAyah || 1;
            const end = toAyah || surah.ayahCount;
            this.validateAyahRange(start, end, surah.ayahCount);
            ayahs = ayahs.filter((ayah) => ayah.ayahNumberInSurah >= start && ayah.ayahNumberInSurah <= end);
        }
        return ayahs;
    }
    async getSurahInfo(id) {
        this.validateSurahId(id);
        return await this.surahRepository.getSurahInfo(id);
    }
    validateSurahId(id) {
        if (id < 1 || id > quran_constants_1.QURAN_CONSTANTS.TOTAL_SURAHS) {
            throw new error_util_1.ValidationError(`Surah ID must be between 1 and ${quran_constants_1.QURAN_CONSTANTS.TOTAL_SURAHS}`);
        }
    }
    validateAyahRange(start, end, totalAyahs) {
        if (start < 1 || end > totalAyahs || start > end) {
            throw new error_util_1.ValidationError(`Invalid ayah range. Must be between 1 and ${totalAyahs}, and start must be <= end`);
        }
    }
}
exports.SurahService = SurahService;
