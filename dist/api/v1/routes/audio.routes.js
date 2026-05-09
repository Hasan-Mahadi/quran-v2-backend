"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
// src/api/v1/routes/audio.routes.ts
const express_1 = require("express");
const zod_1 = require("zod");
const audio_controller_1 = require("../controllers/audio.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const audioController = new audio_controller_1.AudioController();
// Route 1: /:surahId/range - Get available audio range
router.get('/:surahId/range', validation_middleware_1.ValidationMiddleware.validate(zod_1.z.object({
    params: zod_1.z.object({
        surahId: zod_1.z.coerce.number().int().min(1).max(114)
    }),
})), audioController.getAudioRange);
// Route 2: /:surahId/:ayahNumber/info - Get audio metadata
router.get('/:surahId/:ayahNumber/info', validation_middleware_1.ValidationMiddleware.validate(zod_1.z.object({
    params: zod_1.z.object({
        surahId: zod_1.z.coerce.number().int().min(1).max(114),
        ayahNumber: zod_1.z.coerce.number().int().positive(),
    }),
})), audioController.getAudioInfo);
// Route 3: /:surahId/:ayahNumber - Stream audio file
router.get('/:surahId/:ayahNumber', validation_middleware_1.ValidationMiddleware.validate(zod_1.z.object({
    params: zod_1.z.object({
        surahId: zod_1.z.coerce.number().int().min(1).max(114),
        ayahNumber: zod_1.z.coerce.number().int().positive(),
    }),
})), audioController.streamAudio);
exports.default = router;
