"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(3000),
    DATA_PATH: zod_1.z.string().default('./data/quran-dataset'),
    API_VERSION: zod_1.z.string().default('v1'),
    CACHE_TTL: zod_1.z.coerce.number().default(3600),
    CACHE_MAX_KEYS: zod_1.z.coerce.number().default(500),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().default(900000),
    RATE_LIMIT_MAX_REQUESTS: zod_1.z.coerce.number().default(100),
    LOG_LEVEL: zod_1.z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    CORS_ORIGIN: zod_1.z.string().default('*'),
    MAX_JSON_SIZE: zod_1.z.string().default('10mb'),
    SEARCH_CASE_SENSITIVE: zod_1.z.coerce.boolean().default(false),
    ENABLE_SEARCH_CACHE: zod_1.z.coerce.boolean().default(true),
});
exports.config = envSchema.parse(process.env);
