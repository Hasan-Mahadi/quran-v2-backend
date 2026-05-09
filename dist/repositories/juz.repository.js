"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuzRepository = void 0;
const path_1 = __importDefault(require("path"));
const fileSystem_util_1 = require("../utils/fileSystem.util");
const database_config_1 = require("../config/database.config");
const logger_util_1 = require("../utils/logger.util");
class JuzRepository {
    constructor() {
        this.juzCache = null;
        this.fileSystem = fileSystem_util_1.FileSystemUtil.getInstance();
    }
    async findAll() {
        if (this.juzCache) {
            return this.juzCache;
        }
        try {
            const juzPath = path_1.default.join(database_config_1.DATA_CONFIG.BASE_PATH, database_config_1.DATA_CONFIG.JUZ_FILE);
            const juzData = await this.fileSystem.loadJSON(juzPath);
            this.juzCache = juzData;
            logger_util_1.LoggerUtil.info(`Loaded ${this.juzCache.length} juz parts`);
            return this.juzCache;
        }
        catch (error) {
            logger_util_1.LoggerUtil.error('Failed to load juz data', error);
            return [];
        }
    }
    async findById(juzNumber) {
        const allJuz = await this.findAll();
        const juzIndex = juzNumber.toString().padStart(2, '0');
        return allJuz.find((j) => j.index === juzIndex) || null;
    }
    clearCache() {
        this.juzCache = null;
        logger_util_1.LoggerUtil.info('Juz repository cache cleared');
    }
}
exports.JuzRepository = JuzRepository;
