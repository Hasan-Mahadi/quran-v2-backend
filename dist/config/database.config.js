"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_CONFIG = void 0;
const path_1 = __importDefault(require("path"));
exports.DATA_CONFIG = {
    BASE_PATH: process.env.DATA_PATH || './src/data/quran-dataset',
    SURAH_INDEX_FILE: path_1.default.join('source', 'surah.json'),
    JUZ_FILE: path_1.default.join('source', 'juz.json'),
    SURAH_DIR: path_1.default.join('source', 'surah'),
    TAJWEED_DIR: path_1.default.join('source', 'tajweed'),
    TRANSLATION_DIR: path_1.default.join('source', 'translation'),
    AUDIO_DIR: path_1.default.join('source', 'audio'),
    getSurahFile: (surahNumber) => path_1.default.join('source', 'surah', `surah_${surahNumber}.json`),
    getTajweedFile: (surahNumber) => path_1.default.join('source', 'tajweed', `surah_${surahNumber}.json`),
    getTranslationFile: (surahNumber, language) => path_1.default.join('source', 'translation', language, `${language}_translation_${surahNumber}.json`),
    getAudioFile: (surahNumber, ayahNumber) => {
        const surahPadded = surahNumber.toString().padStart(3, '0');
        const ayahPadded = ayahNumber.toString().padStart(3, '0');
        return path_1.default.join('source', 'audio', surahPadded, `${ayahPadded}.mp3`);
    },
    getAudioIndexFile: (surahNumber) => {
        const surahPadded = surahNumber.toString().padStart(3, '0');
        return path_1.default.join('source', 'audio', surahPadded, 'index.json');
    },
};
