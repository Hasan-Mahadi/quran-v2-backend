/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// scripts/inspectData.ts
import fs from 'fs/promises';
import path from 'path';

async function inspectData() {
  const basePath = './src/data/quran-dataset/source';
  
  console.log('🔍 Inspecting Quran Data Structure\n');
  
  // Check surah_1.json structure
  const surah1Path = path.join(basePath, 'surah/surah_1.json');
  console.log('1. Reading:', surah1Path);
  
  try {
    const surah1Data = JSON.parse(await fs.readFile(surah1Path, 'utf-8'));
    console.log('   Top-level keys:', Object.keys(surah1Data));
    console.log('   Structure:', JSON.stringify(surah1Data, null, 2).substring(0, 500));
    
    // Check if ayahs exist
    if (surah1Data.ayahs) {
      console.log(`   ✅ Found ayahs array with ${surah1Data.ayahs.length} ayahs`);
      console.log('   First ayah sample:', surah1Data.ayahs[0]);
    } else if (surah1Data.verses) {
      console.log(`   ✅ Found verses array with ${surah1Data.verses.length} verses`);
      console.log('   First verse sample:', surah1Data.verses[0]);
    } else {
      console.log('   ❌ No ayahs or verses array found');
      console.log('   Available properties:', Object.keys(surah1Data));
    }
  } catch (error) {
    console.log('   Error:', error);
  }
  
  // Check translation structure
  console.log('\n2. Checking Translation Structure');
  const translationPath = path.join(basePath, 'translation/en/en_translation_1.json');
  console.log('   Path:', translationPath);
  
  try {
    const translationData = JSON.parse(await fs.readFile(translationPath, 'utf-8'));
    console.log('   Type:', Array.isArray(translationData) ? 'Array' : 'Object');
    console.log('   Keys:', Object.keys(translationData));
    
    if (Array.isArray(translationData)) {
      console.log(`   ✅ Array with ${translationData.length} translations`);
      console.log('   First item:', translationData[0]);
    } else {
      console.log('   Object structure:', Object.keys(translationData).slice(0, 5));
      // Check if it's an object with ayah keys
      if (translationData['1']) {
        console.log('   ✅ Found ayah 1 translation:', translationData['1']);
      }
    }
  } catch (error) {
    console.log('   Error:', error);
  }
}

inspectData().catch(console.error);