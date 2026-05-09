
import { AudioRepository } from '@/repositories/audio.repository';
import { SurahRepository } from '@/repositories/surah.repository';
import { NotFoundError, ValidationError } from '@/utils/error.util';
import { LoggerUtil } from '@/utils/logger.util';

export class AudioService {
  private audioRepository: AudioRepository;
  private surahRepository: SurahRepository;

  constructor() {
    this.audioRepository = new AudioRepository();
    this.surahRepository = new SurahRepository();
  }

  async getAudioInfo(surahId: number, ayahNumber: number): Promise<any> {
    await this.validateAyah(surahId, ayahNumber);
    
    const audioInfo = await this.audioRepository.getAudioInfo(surahId, ayahNumber);
    
    if (!audioInfo.exists) {
      throw new NotFoundError(`Audio for surah ${surahId}, ayah ${ayahNumber}`);
    }

    return {
      surahId,
      ayahNumber,
      url: `/api/v1/audio/${surahId}/${ayahNumber}`,
      format: audioInfo.format,
    };
  }

  async streamAudio(surahId: number, ayahNumber: number): Promise<Buffer> {
    await this.validateAyah(surahId, ayahNumber);
    
    const audioData = await this.audioRepository.getAudioStream(surahId, ayahNumber);
    
    LoggerUtil.info(`Streaming audio for surah ${surahId}, ayah ${ayahNumber}`);
    
    return audioData;
  }

  private async validateAyah(surahId: number, ayahNumber: number): Promise<void> {
    if (surahId < 1 || surahId > 114) {
      throw new ValidationError('Invalid surah ID');
    }

    const surah = await this.surahRepository.findById(surahId);
    
    if (ayahNumber < 1 || ayahNumber > surah.numberOfAyahs) {
      throw new ValidationError(
        `Invalid ayah number. Surah ${surahId} has ${surah.numberOfAyahs} ayahs`
      );
    }
  }

  async getAvailableAudioRange(surahId: number): Promise<any> {
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

  private async validateSurahId(surahId: number): Promise<void> {
    if (surahId < 1 || surahId > 114) {
      throw new ValidationError('Invalid surah ID');
    }
  }
}