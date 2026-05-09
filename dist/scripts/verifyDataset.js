"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// scripts/verifyDataset.ts
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
async function verifyDataset() {
    const basePath = './src/data/quran-dataset';
    console.log('🔍 Verifying dataset at:', path_1.default.resolve(basePath), '\n');
    // Check main index files
    const indexFiles = [
        'source/surah.json',
        'source/juz.json'
    ];
    for (const file of indexFiles) {
        const fullPath = path_1.default.join(basePath, file);
        try {
            await promises_1.default.access(fullPath);
            const stats = await promises_1.default.stat(fullPath);
            console.log(`✅ Found: ${file} (${stats.size} bytes)`);
        }
        catch {
            console.log(`❌ Missing: ${file}`);
        }
    }
    // Check surah files
    const surahDir = path_1.default.join(basePath, 'source/surah');
    try {
        const files = await promises_1.default.readdir(surahDir);
        const surahFiles = files.filter(f => f.startsWith('surah_') && f.endsWith('.json'));
        console.log(`✅ Surah files: ${surahFiles.length} found`);
        // Check first surah
        if (surahFiles.length > 0) {
            const firstSurah = path_1.default.join(surahDir, surahFiles[0]);
            const data = JSON.parse(await promises_1.default.readFile(firstSurah, 'utf-8'));
            console.log(`   Sample: ${surahFiles[0]} has ${data.ayahs?.length || data.numberOfAyahs} ayahs`);
        }
    }
    catch (error) {
        console.log(`❌ Surah directory not found or empty`);
    }
    // Check translations
    const translationsDir = path_1.default.join(basePath, 'source/translation');
    try {
        const languages = await promises_1.default.readdir(translationsDir);
        console.log(`✅ Translation languages: ${languages.join(', ')}`);
        for (const lang of languages) {
            const langDir = path_1.default.join(translationsDir, lang);
            const files = await promises_1.default.readdir(langDir);
            const transFiles = files.filter(f => f.includes('translation'));
            console.log(`   ${lang}: ${transFiles.length} translation files`);
        }
    }
    catch (error) {
        console.log(`❌ Translation directory not found`);
    }
    // Check audio
    const audioDir = path_1.default.join(basePath, 'source/audio');
    try {
        const surahDirs = await promises_1.default.readdir(audioDir);
        const audioSurahs = surahDirs.filter(d => /^\d{3}$/.test(d));
        console.log(`✅ Audio surahs: ${audioSurahs.length} found`);
        // Check first 3 surahs
        for (let i = 1; i <= Math.min(3, audioSurahs.length); i++) {
            const surahPadded = i.toString().padStart(3, '0');
            const surahAudioDir = path_1.default.join(audioDir, surahPadded);
            const files = await promises_1.default.readdir(surahAudioDir);
            const mp3Files = files.filter(f => f.endsWith('.mp3'));
            console.log(`   Surah ${surahPadded}: ${mp3Files.length} MP3 files`);
        }
    }
    catch (error) {
        console.log(`⚠️ Audio directory not found or no audio files`);
    }
    console.log('\n✅ Verification complete!');
}
verifyDataset().catch(console.error);
