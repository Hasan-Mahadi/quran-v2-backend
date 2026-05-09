/* eslint-disable @typescript-eslint/no-misused-promises */
// src/api/v1/routes/audio.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import { AudioController } from '../controllers/audio.controller';
import { ValidationMiddleware } from '../middleware/validation.middleware';

const router = Router();
const audioController = new AudioController();

// Route 1: /:surahId/range - Get available audio range
router.get(
  '/:surahId/range',
  ValidationMiddleware.validate(
    z.object({
      params: z.object({ 
        surahId: z.coerce.number().int().min(1).max(114) 
      }),
    })
  ),
  audioController.getAudioRange
);

// Route 2: /:surahId/:ayahNumber/info - Get audio metadata
router.get(
  '/:surahId/:ayahNumber/info',
  ValidationMiddleware.validate(
    z.object({
      params: z.object({
        surahId: z.coerce.number().int().min(1).max(114),
        ayahNumber: z.coerce.number().int().positive(),
      }),
    })
  ),
  audioController.getAudioInfo
);

// Route 3: /:surahId/:ayahNumber - Stream audio file
router.get(
  '/:surahId/:ayahNumber',
  ValidationMiddleware.validate(
    z.object({
      params: z.object({
        surahId: z.coerce.number().int().min(1).max(114),
        ayahNumber: z.coerce.number().int().positive(),
      }),
    })
  ),
  audioController.streamAudio
);

export default router;