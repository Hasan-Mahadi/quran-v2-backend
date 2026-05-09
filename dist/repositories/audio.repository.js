"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioRepository = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fileSystem_util_1 = require("../utils/fileSystem.util");
const database_config_1 = require("../config/database.config");
const logger_util_1 = require("../utils/logger.util");
const error_util_1 = require("../utils/error.util");
class AudioRepository {
    constructor() {
        this.audioCache = new Map();
        this.audioIndexCache = new Map();
        this.fileSystem = fileSystem_util_1.FileSystemUtil.getInstance();
    }
    async getAudioIndex(surahId) {
        if (this.audioIndexCache.has(surahId)) {
            return this.audioIndexCache.get(surahId);
        }
        try {
            const indexPath = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, database_config_1.DATA_CONFIG.getAudioIndexFile(surahId));
            const exists = await this.fileSystem.fileExists(indexPath);
            if (!exists) {
                logger_util_1.LoggerUtil.warn(`Audio index not found for surah ${surahId}`);
                return null;
            }
            const audioIndex = await this.fileSystem.loadJSON(indexPath);
            this.audioIndexCache.set(surahId, audioIndex);
            return audioIndex;
        }
        catch (error) {
            logger_util_1.LoggerUtil.error(`Failed to load audio index for surah ${surahId}`, error);
            return null;
        }
    }
    async audioExists(surahId, ayahNumber) {
        const cacheKey = `${surahId}_${ayahNumber}`;
        if (this.audioCache.has(cacheKey)) {
            return this.audioCache.get(cacheKey);
        }
        const audioPath1 = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, database_config_1.DATA_CONFIG.getAudioFile(surahId, ayahNumber));
        const ayahPadded = ayahNumber.toString().padStart(3, '0');
        const audioPath2 = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, `source/audio/${surahId.toString().padStart(3, '0')}/${ayahPadded}.mp3`);
        let exists = await this.fileSystem.fileExists(audioPath1);
        if (!exists) {
            exists = await this.fileSystem.fileExists(audioPath2);
        }
        this.audioCache.set(cacheKey, exists);
        return exists;
    }
    async getAudioInfo(surahId, ayahNumber) {
        const exists = await this.audioExists(surahId, ayahNumber);
        if (!exists) {
            return {
                surahId,
                ayahNumber,
                exists: false,
            };
        }
        const audioIndex = await this.getAudioIndex(surahId);
        const ayahPadded = ayahNumber.toString().padStart(3, '0');
        const indexInfo = audioIndex?.[ayahNumber] || audioIndex?.[ayahPadded];
        let fileSize;
        if (indexInfo?.size) {
            fileSize = indexInfo.size;
        }
        else {
            const surahPadded = surahId.toString().padStart(3, '0');
            const audioPath = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, `source/audio/${surahPadded}/${ayahPadded}.mp3`);
            try {
                const stats = await fs_1.default.promises.stat(audioPath);
                fileSize = stats.size;
            }
            catch (error) {
            }
        }
        return {
            surahId,
            ayahNumber,
            exists: true,
            fileSize,
            format: 'audio/mpeg',
        };
    }
    async getAudioStream(surahId, ayahNumber) {
        const surahPadded = surahId.toString().padStart(3, '0');
        const ayahPadded = ayahNumber.toString().padStart(3, '0');
        const audioPath = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, `source/audio/${surahPadded}/${ayahPadded}.mp3`);
        if (!(await this.audioExists(surahId, ayahNumber))) {
            throw new error_util_1.NotFoundError(`Audio for surah ${surahId}, ayah ${ayahNumber}`);
        }
        try {
            const audioData = await fs_1.default.promises.readFile(audioPath);
            return audioData;
        }
        catch (error) {
            logger_util_1.LoggerUtil.error(`Failed to load audio for surah ${surahId}, ayah ${ayahNumber}`, error);
            throw new error_util_1.NotFoundError(`Audio file not found or corrupted`);
        }
    }
    async getAvailableAyahs(surahId) {
        const surahPadded = surahId.toString().padStart(3, '0');
        const audioDir = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, `source/audio/${surahPadded}`);
        try {
            const files = await fs_1.default.promises.readdir(audioDir);
            const mp3Files = files.filter(f => f.endsWith('.mp3'));
            const ayahNumbers = mp3Files.map(f => parseInt(f.replace('.mp3', ''))).filter(n => !isNaN(n));
            return ayahNumbers.sort((a, b) => a - b);
        }
        catch (error) {
            logger_util_1.LoggerUtil.warn(`Failed to read audio directory for surah ${surahId}`);
            return [];
        }
    }
    clearCache() {
        this.audioCache.clear();
        this.audioIndexCache.clear();
        logger_util_1.LoggerUtil.info('Audio repository cache cleared');
    }
}
exports.AudioRepository = AudioRepository;
