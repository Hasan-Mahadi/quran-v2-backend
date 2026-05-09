"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("../controllers/search.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const search_dto_1 = require("../dto/search.dto");
const zod_1 = __importDefault(require("zod"));
const router = (0, express_1.Router)();
const searchController = new search_controller_1.SearchController();
router.get('/', validation_middleware_1.ValidationMiddleware.validate(zod_1.default.object({
    query: search_dto_1.SearchQuerySchema,
})), searchController.search);
router.get('/stats', searchController.getSearchStats);
exports.default = router;
