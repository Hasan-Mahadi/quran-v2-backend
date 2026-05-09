"use strict";
/* eslint-disable @typescript-eslint/no-misused-promises */
Object.defineProperty(exports, "__esModule", { value: true });
// src/api/v1/routes/juz.routes.ts
const express_1 = require("express");
const juz_controller_1 = require("../controllers/juz.controller");
const router = (0, express_1.Router)();
const juzController = new juz_controller_1.JuzController();
router.get('/', juzController.getAllJuz);
router.get('/:id', juzController.getJuzById);
exports.default = router;
