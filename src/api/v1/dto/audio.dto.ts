// src/api/v1/dto/audio.dto.ts
import { z } from 'zod';

export const GetAudioParamsSchema = z.object({
  surahId: z.coerce.number().int().min(1).max(114),
  ayahNumber: z.coerce.number().int().positive(),
});

export const GetAudioRangeParamsSchema = z.object({
  surahId: z.coerce.number().int().min(1).max(114),
});

export type GetAudioParamsDTO = z.infer<typeof GetAudioParamsSchema>;
export type GetAudioRangeParamsDTO = z.infer<typeof GetAudioRangeParamsSchema>;