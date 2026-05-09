 
// src/api/v1/controllers/juz.controller.ts
import { Request, Response } from 'express';
import { JuzRepository } from '@/repositories/juz.repository';
import { ApiResponse } from '@/utils/response.util';

export class JuzController {
  private juzRepository: JuzRepository;

  constructor() {
    this.juzRepository = new JuzRepository();
  }

  getAllJuz = async (_req: Request, res: Response): Promise<Response> => {
    const juzList = await this.juzRepository.findAll();
    return ApiResponse.success(res, juzList);
  };

  getJuzById = async (req: Request, res: Response): Promise<Response> => {
    const id = parseInt(req.params.id);
    const juz = await this.juzRepository.findById(id);
    
    if (!juz) {
      return ApiResponse.error(res, 'NOT_FOUND', `Juz ${id} not found`, null, 404);
    }
    
    return ApiResponse.success(res, juz);
  };
}