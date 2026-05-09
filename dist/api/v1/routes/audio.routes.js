"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const audio_controller_1 = require("../controllers/audio.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const audioController = new audio_controller_1.AudioController();
router.get('/:surahId/range', validation_middleware_1.ValidationMiddleware.validate(zod_1.z.object({
    params: zod_1.z.object({
        surahId: zod_1.z.coerce.number().int().min(1).max(114)
    }),
})), audioController.getAudioRange);
router.get('/:surahId/:ayahNumber/info', validation_middleware_1.ValidationMiddleware.validate(zod_1.z.object({
    params: zod_1.z.object({
        surahId: zod_1.z.coerce.number().int().min(1).max(114),
        ayahNumber: zod_1.z.coerce.number().int().positive(),
    }),
})), audioController.getAudioInfo);
router.get('/:surahId/:ayahNumber', validation_middleware_1.ValidationMiddleware.validate(zod_1.z.object({
    params: zod_1.z.object({
        surahId: zod_1.z.coerce.number().int().min(1).max(114),
        ayahNumber: zod_1.z.coerce.number().int().positive(),
    }),
})), audioController.streamAudio);
exports.default = router;
