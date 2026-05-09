/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// scripts/verifyDataset.ts
import fs from 'fs/promises';
import path from 'path';

async function verifyDataset() {
  const basePath = './src/data/quran-dataset';
  
  console.log('🔍 Verifying dataset at:', path.resolve(basePath), '\n');
  
  // Check main index files
  const indexFiles = [
    'source/surah.json',
    'source/juz.json'
  ];
  
  for (const file of indexFiles) {
    const fullPath = path.join(basePath, file);
    try {
      await fs.access(fullPath);
      const stats = await fs.stat(fullPath);
      console.log(`✅ Found: ${file} (${stats.size} bytes)`);
    } catch {
      console.log(`❌ Missing: ${file}`);
    }
  }
  
  // Check surah files
  const surahDir = path.join(basePath, 'source/surah');
  try {
    const files = await fs.readdir(surahDir);
    const surahFiles = files.filter(f => f.startsWith('surah_') && f.endsWith('.json'));
    console.log(`✅ Surah files: ${surahFiles.length} found`);
    
    // Check first surah
    if (surahFiles.length > 0) {
      const firstSurah = path.join(surahDir, surahFiles[0]);
      const data = JSON.parse(await fs.readFile(firstSurah, 'utf-8'));
      console.log(`   Sample: ${surahFiles[0]} has ${data.ayahs?.length || data.numberOfAyahs} ayahs`);
    }
  } catch (error) {
    console.log(`❌ Surah directory not found or empty`);
  }
  
  // Check translations
  const translationsDir = path.join(basePath, 'source/translation');
  try {
    const languages = await fs.readdir(translationsDir);
    console.log(`✅ Translation languages: ${languages.join(', ')}`);
    
    for (const lang of languages) {
      const langDir = path.join(translationsDir, lang);
      const files = await fs.readdir(langDir);
      const transFiles = files.filter(f => f.includes('translation'));
      console.log(`   ${lang}: ${transFiles.length} translation files`);
    }
  } catch (error) {
    console.log(`❌ Translation directory not found`);
  }
  
  // Check audio
  const audioDir = path.join(basePath, 'source/audio');
  try {
    const surahDirs = await fs.readdir(audioDir);
    const audioSurahs = surahDirs.filter(d => /^\d{3}$/.test(d));
    console.log(`✅ Audio surahs: ${audioSurahs.length} found`);
    
    // Check first 3 surahs
    for (let i = 1; i <= Math.min(3, audioSurahs.length); i++) {
      const surahPadded = i.toString().padStart(3, '0');
      const surahAudioDir = path.join(audioDir, surahPadded);
      const files = await fs.readdir(surahAudioDir);
      const mp3Files = files.filter(f => f.endsWith('.mp3'));
      console.log(`   Surah ${surahPadded}: ${mp3Files.length} MP3 files`);
    }
  } catch (error) {
    console.log(`⚠️ Audio directory not found or no audio files`);
  }
  
  console.log('\n✅ Verification complete!');
}

verifyDataset().catch(console.error);