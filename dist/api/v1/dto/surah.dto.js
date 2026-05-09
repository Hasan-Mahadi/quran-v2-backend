"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAyahsQuerySchema = exports.GetSurahQuerySchema = exports.GetSurahParamsSchema = void 0;
const zod_1 = require("zod");
const common_dto_1 = require("./common.dto");
exports.GetSurahParamsSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().int().min(1).max(114),
});
exports.GetSurahQuerySchema = common_dto_1.LanguageQuerySchema;
exports.GetAyahsQuerySchema = common_dto_1.LanguageQuerySchema.merge(zod_1.z.object({
    from: zod_1.z.coerce.number().int().positive().optional(),
    to: zod_1.z.coerce.number().int().positive().optional(),
}));
