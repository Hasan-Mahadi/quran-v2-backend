"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const api_constants_1 = require("../../../constants/api.constants");
exports.rateLimitMiddleware = (0, express_rate_limit_1.default)({
    windowMs: api_constants_1.API_CONFIG.RATE_LIMIT.WINDOW_MS,
    max: api_constants_1.API_CONFIG.RATE_LIMIT.MAX_REQUESTS,
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later.',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
