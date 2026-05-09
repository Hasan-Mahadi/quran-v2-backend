/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Request, Response } from 'express';


import { GetSurahParamsDTO, GetSurahQueryDTO, GetAyahsQueryDTO } from '../dto/surah.dto';
import { SurahService } from '../../../services/quran/surah.service';
import { ApiResponse } from '../../../utils/response.util';

export class SurahController {
  private surahService: SurahService;

  constructor() {
    this.surahService = new SurahService();
  }

  getAllSurahs = async (_req: Request, res: Response): Promise<Response> => {
    const surahs = await this.surahService.getAllSurahs();
    return ApiResponse.success(res, surahs);
  };

  getSurahById = async (req: Request, res: Response): Promise<Response> => {
    const params = req.params as unknown as GetSurahParamsDTO;
    const query = req.query as unknown as GetSurahQueryDTO;

    const surah = await this.surahService.getSurahById(params.id, query.language);
    return ApiResponse.success(res, surah);
  };

  getSurahAyahs = async (req: Request, res: Response): Promise<Response> => {
    const params = req.params as unknown as GetSurahParamsDTO;
    const query = req.query as unknown as GetAyahsQueryDTO;

    const ayahs = await this.surahService.getSurahAyahs(
      params.id,
      query.from,
      query.to,
      query.language
    );
    return ApiResponse.success(res, ayahs);
  };

  getSurahInfo = async (req: Request, res: Response): Promise<Response> => {
    const params = req.params as unknown as GetSurahParamsDTO;
    
    const surahInfo = await this.surahService.getSurahInfo(params.id);
    return ApiResponse.success(res, surahInfo);
  };
}