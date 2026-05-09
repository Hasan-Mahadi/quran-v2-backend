"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageQuerySchema = exports.PaginationQuerySchema = void 0;
const zod_1 = require("zod");
exports.PaginationQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
});
exports.LanguageQuerySchema = zod_1.z.object({
    language: zod_1.z.enum(['en', 'id', 'ar']).default('en'),
});
