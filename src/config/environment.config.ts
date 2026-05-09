
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATA_PATH: z.string().default('./data/quran-dataset'),
  API_VERSION: z.string().default('v1'),
  CACHE_TTL: z.coerce.number().default(3600),
  CACHE_MAX_KEYS: z.coerce.number().default(500),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  CORS_ORIGIN: z.string().default('*'),
  MAX_JSON_SIZE: z.string().default('10mb'),
  SEARCH_CASE_SENSITIVE: z.coerce.boolean().default(false),
  ENABLE_SEARCH_CACHE: z.coerce.boolean().default(true),
});

export const config = envSchema.parse(process.env);
export type EnvConfig = z.infer<typeof envSchema>;