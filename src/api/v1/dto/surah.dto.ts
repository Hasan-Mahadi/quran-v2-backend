
import { z } from 'zod';
import { LanguageQuerySchema } from './common.dto';

export const GetSurahParamsSchema = z.object({
  id: z.coerce.number().int().min(1).max(114),
});

export const GetSurahQuerySchema = LanguageQuerySchema;

export const GetAyahsQuerySchema = LanguageQuerySchema.merge(
  z.object({
    from: z.coerce.number().int().positive().optional(),
    to: z.coerce.number().int().positive().optional(),
  })
);

export type GetSurahParamsDTO = z.infer<typeof GetSurahParamsSchema>;
export type GetSurahQueryDTO = z.infer<typeof GetSurahQuerySchema>;
export type GetAyahsQueryDTO = z.infer<typeof GetAyahsQuerySchema>;