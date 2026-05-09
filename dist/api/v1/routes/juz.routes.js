"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const juz_controller_1 = require("../controllers/juz.controller");
const router = (0, express_1.Router)();
const juzController = new juz_controller_1.JuzController();
router.get('/', juzController.getAllJuz);
router.get('/:id', juzController.getJuzById);
exports.default = router;
