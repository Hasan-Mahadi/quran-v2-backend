"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAudioRangeParamsSchema = exports.GetAudioParamsSchema = void 0;
const zod_1 = require("zod");
exports.GetAudioParamsSchema = zod_1.z.object({
    surahId: zod_1.z.coerce.number().int().min(1).max(114),
    ayahNumber: zod_1.z.coerce.number().int().positive(),
});
exports.GetAudioRangeParamsSchema = zod_1.z.object({
    surahId: zod_1.z.coerce.number().int().min(1).max(114),
});
