
import { z } from 'zod';
import { PaginationQuerySchema } from './common.dto';

export const SearchQuerySchema = PaginationQuerySchema.merge(
  z.object({
    q: z.string().min(2).max(100),
    type: z.enum(['arabic', 'translation']).default('arabic'),
    language: z.enum(['en', 'id', 'ar']).optional(),
  })
);

export type SearchQueryDTO = z.infer<typeof SearchQuerySchema>;