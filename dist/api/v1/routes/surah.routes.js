"use strict";
/* eslint-disable @typescript-eslint/no-misused-promises */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const surah_controller_1 = require("../controllers/surah.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const surah_dto_1 = require("../dto/surah.dto");
const zod_1 = __importDefault(require("zod"));
const router = (0, express_1.Router)();
const surahController = new surah_controller_1.SurahController();
router.get('/', surahController.getAllSurahs);
router.get('/:id', validation_middleware_1.ValidationMiddleware.validate(zod_1.default.object({
    params: surah_dto_1.GetSurahParamsSchema,
    query: surah_dto_1.GetSurahQuerySchema,
})), surahController.getSurahById);
router.get('/:id/ayahs', validation_middleware_1.ValidationMiddleware.validate(zod_1.default.object({
    params: surah_dto_1.GetSurahParamsSchema,
    query: surah_dto_1.GetAyahsQuerySchema,
})), surahController.getSurahAyahs);
router.get('/:id/info', validation_middleware_1.ValidationMiddleware.validate(zod_1.default.object({
    params: surah_dto_1.GetSurahParamsSchema,
})), surahController.getSurahInfo);
exports.default = router;
