
import { z } from 'zod';

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationQueryDTO = z.infer<typeof PaginationQuerySchema>;

export const LanguageQuerySchema = z.object({
  language: z.enum(['en', 'id', 'ar']).default('en'),
});

export type LanguageQueryDTO = z.infer<typeof LanguageQuerySchema>;