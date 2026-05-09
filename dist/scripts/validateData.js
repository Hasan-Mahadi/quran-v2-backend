"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileSystem_util_1 = require("../utils/fileSystem.util");
const database_config_1 = require("../config/database.config");
const path_1 = __importDefault(require("path"));
async function validateDataset() {
    const fsUtil = fileSystem_util_1.FileSystemUtil.getInstance();
    console.log('🔍 Validating Quran Dataset Structure...\n');
    const surahIndexPath = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, database_config_1.DATA_CONFIG.SURAH_INDEX_FILE);
    const hasSurahIndex = await fsUtil.fileExists(surahIndexPath);
    console.log(`${hasSurahIndex ? '✅' : '❌'} Surah index file: ${surahIndexPath}`);
    if (hasSurahIndex) {
        const surahIndex = await fsUtil.loadJSON(surahIndexPath);
        console.log(`   📚 Found ${surahIndex.length} surahs in index`);
        let missingSurahFiles = 0;
        for (const surah of surahIndex) {
            const surahPath = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, database_config_1.DATA_CONFIG.getSurahFile(surah.number));
            const exists = await fsUtil.fileExists(surahPath);
            if (!exists) {
                console.log(`   ⚠️ Missing surah file: surah_${surah.number}.json`);
                missingSurahFiles++;
            }
        }
        if (missingSurahFiles === 0) {
            console.log(`   ✅ All ${surahIndex.length} surah files present`);
        }
        else {
            console.log(`   ❌ ${missingSurahFiles} surah files missing`);
        }
    }
    const languages = ['en', 'id', 'ar'];
    for (const lang of languages) {
        const translationDir = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, `source/translation/${lang}`);
        const hasDir = await fsUtil.fileExists(translationDir);
        console.log(`${hasDir ? '✅' : '❌'} Translation directory: ${lang}`);
        if (hasDir) {
            const files = await fsUtil.getDirectoryContents(translationDir);
            const translationFiles = files.filter(f => f.includes('translation'));
            console.log(`   📖 Found ${translationFiles.length} translation files for ${lang}`);
        }
    }
    console.log('\n🎵 Audio Files Check:');
    for (let i = 1; i <= 3; i++) {
        const surahPadded = i.toString().padStart(3, '0');
        const audioDir = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, `source/audio/${surahPadded}`);
        const hasAudioDir = await fsUtil.fileExists(audioDir);
        if (hasAudioDir) {
            const audioFiles = await fsUtil.getDirectoryContents(audioDir);
            const mp3Files = audioFiles.filter(f => f.endsWith('.mp3'));
            console.log(`   ✅ Surah ${surahPadded}: ${mp3Files.length} audio files`);
            const indexPath = path_1.default.join(audioDir, 'index.json');
            const hasIndex = await fsUtil.fileExists(indexPath);
            if (hasIndex) {
                console.log(`      📋 Audio index present`);
            }
        }
        else {
            console.log(`   ⚠️ Surah ${surahPadded}: No audio directory`);
        }
    }
    console.log('\n✅ Dataset validation complete!');
}
validateDataset().catch(console.error);
