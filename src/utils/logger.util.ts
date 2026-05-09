// src/utils/logger.util.ts
import winston from 'winston';
import { config } from '../config/environment.config';


// Only show debug logs in development if explicitly enabled
const logLevel = config.NODE_ENV === 'production' ? 'info' : (process.env.LOG_LEVEL || 'info');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
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
  })
);

export const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export class LoggerUtil {
  static info(message: string, meta?: Record<string, unknown>) {
    logger.info(message, meta);
  }

  static error(message: string, error?: Error, meta?: Record<string, unknown>) {
    logger.error(message, {
      errorMessage: error?.message,
      errorStack: error?.stack,
      ...meta,
    });
  }

  static warn(message: string, meta?: Record<string, unknown>) {
    logger.warn(message, meta);
  }

  static debug(message: string, meta?: Record<string, unknown>) {
    // Only log debug if explicitly enabled
    if (process.env.SHOW_DEBUG === 'true') {
      logger.debug(message, meta);
    }
  }
}