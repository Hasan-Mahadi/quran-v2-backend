"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemUtil = void 0;
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const logger_util_1 = require("./logger.util");
const error_util_1 = require("./error.util");
const api_constants_1 = require("../constants/api.constants");
class FileSystemUtil {
    constructor() {
        this.jsonCache = new Map();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new FileSystemUtil();
        }
        return this.instance;
    }
    async loadJSON(filePath, useCache = true) {
        const cacheKey = filePath;
        if (useCache && this.jsonCache.has(cacheKey)) {
            logger_util_1.LoggerUtil.debug(`Cache hit for ${filePath}`);
            return this.jsonCache.get(cacheKey);
        }
        try {
            const absolutePath = path_1.default.resolve(process.cwd(), filePath);
            const fileContent = await fs.readFile(absolutePath, 'utf-8');
            const data = JSON.parse(fileContent);
            if (useCache) {
                this.jsonCache.set(cacheKey, data);
            }
            return data;
        }
        catch (error) {
            logger_util_1.LoggerUtil.error(`Failed to load JSON from ${filePath}`, error);
            throw new error_util_1.BusinessError(api_constants_1.ERROR_CODES.FILE_SYSTEM_ERROR, `Failed to load data from ${filePath}`, { originalError: error.message });
        }
    }
    async loadBinary(filePath) {
        try {
            const absolutePath = path_1.default.resolve(process.cwd(), filePath);
            return await fs.readFile(absolutePath);
        }
        catch (error) {
            logger_util_1.LoggerUtil.error(`Failed to load binary from ${filePath}`, error);
            throw new error_util_1.BusinessError(api_constants_1.ERROR_CODES.FILE_SYSTEM_ERROR, `Failed to load file from ${filePath}`, { originalError: error.message });
        }
    }
    async fileExists(filePath) {
        try {
            const absolutePath = path_1.default.resolve(process.cwd(), filePath);
            await fs.access(absolutePath);
            return true;
        }
        catch {
            return false;
        }
    }
    async getDirectoryContents(dirPath) {
        try {
            const absolutePath = path_1.default.resolve(process.cwd(), dirPath);
            const files = await fs.readdir(absolutePath);
            return files;
        }
        catch (error) {
            logger_util_1.LoggerUtil.error(`Failed to read directory ${dirPath}`, error);
            return [];
        }
    }
    async getFileStats(filePath) {
        try {
            const absolutePath = path_1.default.resolve(process.cwd(), filePath);
            return await fs.stat(absolutePath);
        }
        catch {
            return null;
        }
    }
    clearCache() {
        this.jsonCache.clear();
        logger_util_1.LoggerUtil.info('File system JSON cache cleared');
    }
}
exports.FileSystemUtil = FileSystemUtil;
