/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/api/v1/controllers/audio.controller.ts
import { Request, Response } from 'express';
import { AudioService } from '../../../services/quran/audio.service';
import { ApiResponse } from '../../../utils/response.util';


export class AudioController {
  private audioService: AudioService;

  constructor() {
    this.audioService = new AudioService();
  }

  getAudioInfo = async (req: Request, res: Response): Promise<Response> => {
    const surahId = parseInt(req.params.surahId);
    const ayahNumber = parseInt(req.params.ayahNumber);
    
    const audioInfo = await this.audioService.getAudioInfo(surahId, ayahNumber);
    
    return ApiResponse.success(res, audioInfo);
  };

  streamAudio = async (req: Request, res: Response): Promise<void> => {
    const surahId = parseInt(req.params.surahId);
    const ayahNumber = parseInt(req.params.ayahNumber);
    
    const audioData = await this.audioService.streamAudio(surahId, ayahNumber);
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(audioData);
  };

  getAudioRange = async (req: Request, res: Response): Promise<Response> => {
    const surahId = parseInt(req.params.surahId);
    
    const range = await this.audioService.getAvailableAudioRange(surahId);
    
    return ApiResponse.success(res, range);
  };
}