/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express';
import { SurahController } from '../controllers/surah.controller';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { GetSurahParamsSchema, GetSurahQuerySchema, GetAyahsQuerySchema } from '../dto/surah.dto';
import z from 'zod';

const router = Router();
const surahController = new SurahController();

router.get('/', surahController.getAllSurahs);

router.get(
  '/:id',
  ValidationMiddleware.validate(
    z.object({
      params: GetSurahParamsSchema,
      query: GetSurahQuerySchema,
    })
  ),
  surahController.getSurahById
);

router.get(
  '/:id/ayahs',
  ValidationMiddleware.validate(
    z.object({
      params: GetSurahParamsSchema,
      query: GetAyahsQuerySchema,
    })
  ),
  surahController.getSurahAyahs
);

router.get(
  '/:id/info',
  ValidationMiddleware.validate(
    z.object({
      params: GetSurahParamsSchema,
    })
  ),
  surahController.getSurahInfo
);

export default router;