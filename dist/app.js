"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
require("express-async-errors");
const environment_config_1 = require("./config/environment.config");
const rateLimit_middleware_1 = require("./api/v1/middleware/rateLimit.middleware");
const errorHandler_middleware_1 = require("./api/v1/middleware/errorHandler.middleware");
const logger_util_1 = require("./utils/logger.util");
const surah_routes_1 = __importDefault(require("./api/v1/routes/surah.routes"));
const search_routes_1 = __importDefault(require("./api/v1/routes/search.routes"));
const audio_routes_1 = __importDefault(require("./api/v1/routes/audio.routes"));
const search_service_1 = require("./services/quran/search.service");
const juz_routes_1 = __importDefault(require("./api/v1/routes/juz.routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: environment_config_1.config.CORS_ORIGIN,
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: environment_config_1.config.MAX_JSON_SIZE }));
app.use(rateLimit_middleware_1.rateLimitMiddleware);
app.use((req, _res, next) => {
    logger_util_1.LoggerUtil.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next();
});
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
app.use(`/api/${environment_config_1.config.API_VERSION}/surahs`, surah_routes_1.default);
app.use(`/api/${environment_config_1.config.API_VERSION}/search`, search_routes_1.default);
app.use(`/api/${environment_config_1.config.API_VERSION}/audio`, audio_routes_1.default);
app.use(`/api/${environment_config_1.config.API_VERSION}/juz`, juz_routes_1.default);
app.use(errorHandler_middleware_1.ErrorHandlerMiddleware.handle);
const searchService = new search_service_1.SearchService();
searchService.initializeSearchIndex().catch((error) => {
    logger_util_1.LoggerUtil.error('Failed to initialize search index', error);
});
if (require.main === module) {
    app.listen(environment_config_1.config.PORT, () => {
        logger_util_1.LoggerUtil.info(`Quran API Server running on port ${environment_config_1.config.PORT}`);
        logger_util_1.LoggerUtil.info(`Environment: ${environment_config_1.config.NODE_ENV}`);
        logger_util_1.LoggerUtil.info(`API Version: ${environment_config_1.config.API_VERSION}`);
    });
}
exports.default = app;
