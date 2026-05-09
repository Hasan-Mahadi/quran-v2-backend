"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioService = void 0;
const audio_repository_1 = require("../../repositories/audio.repository");
const surah_repository_1 = require("../../repositories/surah.repository");
const error_util_1 = require("../../utils/error.util");
const logger_util_1 = require("../../utils/logger.util");
class AudioService {
    constructor() {
        this.audioRepository = new audio_repository_1.AudioRepository();
        this.surahRepository = new surah_repository_1.SurahRepository();
    }
    async getAudioInfo(surahId, ayahNumber) {
        await this.validateAyah(surahId, ayahNumber);
        const audioInfo = await this.audioRepository.getAudioInfo(surahId, ayahNumber);
        if (!audioInfo.exists) {
            throw new error_util_1.NotFoundError(`Audio for surah ${surahId}, ayah ${ayahNumber}`);
        }
        return {
            surahId,
            ayahNumber,
            url: `/api/v1/audio/${surahId}/${ayahNumber}`,
            format: audioInfo.format,
        };
    }
    async streamAudio(surahId, ayahNumber) {
        await this.validateAyah(surahId, ayahNumber);
        const audioData = await this.audioRepository.getAudioStream(surahId, ayahNumber);
        logger_util_1.LoggerUtil.info(`Streaming audio for surah ${surahId}, ayah ${ayahNumber}`);
        return audioData;
    }
    async validateAyah(surahId, ayahNumber) {
        if (surahId < 1 || surahId > 114) {
            throw new error_util_1.ValidationError('Invalid surah ID');
        }
        const surah = await this.surahRepository.findById(surahId);
        if (ayahNumber < 1 || ayahNumber > surah.numberOfAyahs) {
            throw new error_util_1.ValidationError(`Invalid ayah number. Surah ${surahId} has ${surah.numberOfAyahs} ayahs`);
        }
    }
    async getAvailableAudioRange(surahId) {
        await this.validateSurahId(surahId);
        const surah = await this.surahRepository.findById(surahId);
        const availableAyahs = [];
        for (let i = 1; i <= surah.numberOfAyahs; i++) {
            const exists = await this.audioRepository.audioExists(surahId, i);
            if (exists) {
                availableAyahs.push(i);
            }
        }
        return {
            surahId,
            totalAyahs: surah.numberOfAyahs,
            availableAyahs,
            availableCount: availableAyahs.length,
        };
    }
    async validateSurahId(surahId) {
        if (surahId < 1 || surahId > 114) {
            throw new error_util_1.ValidationError('Invalid surah ID');
        }
    }
}
exports.AudioService = AudioService;
