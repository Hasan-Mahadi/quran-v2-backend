/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */


import { FileSystemUtil } from '../utils/fileSystem.util';
import { DATA_CONFIG } from '../config/database.config';
import path from 'path';

async function validateDataset() {
  const fsUtil = FileSystemUtil.getInstance();
  
  console.log('🔍 Validating Quran Dataset Structure...\n');
  
  // Check surah index
  const surahIndexPath = path.join(DATA_CONFIG.BASE_PATH, DATA_CONFIG.SURAH_INDEX_FILE);
  const hasSurahIndex = await fsUtil.fileExists(surahIndexPath);
  console.log(`${hasSurahIndex ? '✅' : '❌'} Surah index file: ${surahIndexPath}`);
  
  if (hasSurahIndex) {
    const surahIndex = await fsUtil.loadJSON<any[]>(surahIndexPath);
    console.log(`   📚 Found ${surahIndex.length} surahs in index`);
    
    // Validate each surah file exists
    let missingSurahFiles = 0;
    for (const surah of surahIndex) {
      const surahPath = path.join(DATA_CONFIG.BASE_PATH, DATA_CONFIG.getSurahFile(surah.number));
      const exists = await fsUtil.fileExists(surahPath);
      if (!exists) {
        console.log(`   ⚠️ Missing surah file: surah_${surah.number}.json`);
        missingSurahFiles++;
      }
    }
    
    if (missingSurahFiles === 0) {
      console.log(`   ✅ All ${surahIndex.length} surah files present`);
    } else {
      console.log(`   ❌ ${missingSurahFiles} surah files missing`);
    }
  }
  
  // Check translations
  const languages = ['en', 'id', 'ar'];
  for (const lang of languages) {
    const translationDir = path.join(DATA_CONFIG.BASE_PATH, `source/translation/${lang}`);
    const hasDir = await fsUtil.fileExists(translationDir);
    console.log(`${hasDir ? '✅' : '❌'} Translation directory: ${lang}`);
    
    if (hasDir) {
      const files = await fsUtil.getDirectoryContents(translationDir);
      const translationFiles = files.filter(f => f.includes('translation'));
      console.log(`   📖 Found ${translationFiles.length} translation files for ${lang}`);
    }
  }
  
  // Check audio files (sample first few surahs)
  console.log('\n🎵 Audio Files Check:');
  for (let i = 1; i <= 3; i++) {
    const surahPadded = i.toString().padStart(3, '0');
    const audioDir = path.join(DATA_CONFIG.BASE_PATH, `source/audio/${surahPadded}`);
    const hasAudioDir = await fsUtil.fileExists(audioDir);
    
    if (hasAudioDir) {
      const audioFiles = await fsUtil.getDirectoryContents(audioDir);
      const mp3Files = audioFiles.filter(f => f.endsWith('.mp3'));
      console.log(`   ✅ Surah ${surahPadded}: ${mp3Files.length} audio files`);
      
      // Check for index.json
      const indexPath = path.join(audioDir, 'index.json');
      const hasIndex = await fsUtil.fileExists(indexPath);
      if (hasIndex) {
        console.log(`      📋 Audio index present`);
      }
    } else {
      console.log(`   ⚠️ Surah ${surahPadded}: No audio directory`);
    }
  }
  
  console.log('\n✅ Dataset validation complete!');
}

validateDataset().catch(console.error);