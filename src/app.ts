/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import 'express-async-errors';
import { config } from './config/environment.config';
import { rateLimitMiddleware } from './api/v1/middleware/rateLimit.middleware';
import { ErrorHandlerMiddleware } from './api/v1/middleware/errorHandler.middleware';
import { LoggerUtil } from './utils/logger.util';
import surahRoutes from './api/v1/routes/surah.routes';
import searchRoutes from './api/v1/routes/search.routes';
import audioRoutes from './api/v1/routes/audio.routes';
import { SearchService } from './services/quran/search.service';
import juzRoutes from './api/v1/routes/juz.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true,
}));

// Performance middleware
app.use(compression());
app.use(express.json({ limit: config.MAX_JSON_SIZE }));

// Rate limiting
app.use(rateLimitMiddleware);

// Request logging
app.use((req, _res, next) => {
  LoggerUtil.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.use(`/api/${config.API_VERSION}/surahs`, surahRoutes);
app.use(`/api/${config.API_VERSION}/search`, searchRoutes);
app.use(`/api/${config.API_VERSION}/audio`, audioRoutes);
app.use(`/api/${config.API_VERSION}/juz`, juzRoutes);

// Error handling (must be last)
app.use(ErrorHandlerMiddleware.handle);

// Initialize search index on startup
const searchService = new SearchService();
searchService.initializeSearchIndex().catch((error) => {
  LoggerUtil.error('Failed to initialize search index', error);
});

// Start server
if (require.main === module) {
  app.listen(config.PORT, () => {
    LoggerUtil.info(`Quran API Server running on port ${config.PORT}`);
    LoggerUtil.info(`Environment: ${config.NODE_ENV}`);
    LoggerUtil.info(`API Version: ${config.API_VERSION}`);
  });
}

export default app;