"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerUtil = exports.logger = void 0;
// src/utils/logger.util.ts
const winston_1 = __importDefault(require("winston"));
const environment_config_1 = require("../config/environment.config");
// Only show debug logs in development if explicitly enabled
const logLevel = environment_config_1.config.NODE_ENV === 'production' ? 'info' : (process.env.LOG_LEVEL || 'info');
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    // Skip debug logs unless specifically wanted
    if (level === 'debug' && process.env.SHOW_DEBUG !== 'true') {
        return '';
    }
    return JSON.stringify({
        timestamp,
        level,
        message,
        stack: stack || undefined,
        ...meta,
    });
}));
exports.logger = winston_1.default.createLogger({
    level: logLevel,
    format: logFormat,
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
        }),
    ],
});
class LoggerUtil {
    static info(message, meta) {
        exports.logger.info(message, meta);
    }
    static error(message, error, meta) {
        exports.logger.error(message, {
            errorMessage: error?.message,
            errorStack: error?.stack,
            ...meta,
        });
    }
    static warn(message, meta) {
        exports.logger.warn(message, meta);
    }
    static debug(message, meta) {
        // Only log debug if explicitly enabled
        if (process.env.SHOW_DEBUG === 'true') {
            exports.logger.debug(message, meta);
        }
    }
}
exports.LoggerUtil = LoggerUtil;
