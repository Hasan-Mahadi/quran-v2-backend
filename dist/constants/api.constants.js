"use strict";
// export const API_CONFIG = {
//   VERSION: process.env.API_VERSION || 'v1',
//   BASE_PATH: '/api',
//   CORS_ORIGINS: (process.env.CORS_ORIGIN || '*').split(','),
//   MAX_JSON_SIZE: process.env.MAX_JSON_SIZE || '10mb',
//   RATE_LIMIT: {
//     WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
//     MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
//   },
// } as const;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = exports.HTTP_STATUS = exports.API_CONFIG = void 0;
// export const HTTP_STATUS = {
//   OK: 200,
//   CREATED: 201,
//   BAD_REQUEST: 400,
//   UNAUTHORIZED: 401,
//   FORBIDDEN: 403,
//   NOT_FOUND: 404,
//   TOO_MANY_REQUESTS: 429,
//   INTERNAL_SERVER_ERROR: 500,
// } as const;
// export const ERROR_CODES = {
//   VALIDATION_ERROR: 'VALIDATION_001',
//   RESOURCE_NOT_FOUND: 'RESOURCE_001',
//   RATE_LIMIT_EXCEEDED: 'RATE_001',
//   INVALID_SURAH_ID: 'VALIDATION_002',
//   INVALID_AYAH_NUMBER: 'VALIDATION_003',
//   DATA_CORRUPTION: 'BUSINESS_001',
//   TRANSLATION_NOT_FOUND: 'BUSINESS_002',
//   DATABASE_ERROR: 'DB_001',
//   FILE_SYSTEM_ERROR: 'FS_001',
//   INTERNAL_ERROR: 'SERVER_001',
// } as const;
// src/constants/api.constants.ts
exports.API_CONFIG = {
    VERSION: process.env.API_VERSION || 'v1',
    BASE_PATH: '/api',
    CORS_ORIGINS: (process.env.CORS_ORIGIN || '*').split(','),
    MAX_JSON_SIZE: process.env.MAX_JSON_SIZE || '10mb',
    RATE_LIMIT: {
        WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
};
exports.ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_001',
    RESOURCE_NOT_FOUND: 'RESOURCE_001',
    RATE_LIMIT_EXCEEDED: 'RATE_001',
    INVALID_SURAH_ID: 'VALIDATION_002',
    INVALID_AYAH_NUMBER: 'VALIDATION_003',
    DATA_CORRUPTION: 'BUSINESS_001',
    TRANSLATION_NOT_FOUND: 'BUSINESS_002',
    DATABASE_ERROR: 'DB_001',
    FILE_SYSTEM_ERROR: 'FS_001',
    INTERNAL_ERROR: 'SERVER_001',
};
