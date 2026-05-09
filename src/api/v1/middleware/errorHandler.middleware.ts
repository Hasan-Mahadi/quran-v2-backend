
import { Request, Response, NextFunction } from 'express';
import { LoggerUtil } from '../../../utils/logger.util';
import { ApiResponse } from '../../../utils/response.util';
import { AppError } from '../../../utils/error.util';
import { HTTP_STATUS } from '../../../constants/api.constants';


export class ErrorHandlerMiddleware {
  static handle(error: Error, req: Request, res: Response, _next: NextFunction) {
    LoggerUtil.error('Unhandled error', error, {
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    if (error instanceof AppError) {
      return ApiResponse.error(
        res,
        error.code,
        error.message,
        process.env.NODE_ENV === 'development' ? error.details : undefined,
        error.statusCode
      );
    }

    // Handle unknown errors
    return ApiResponse.error(
      res,
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred',
      process.env.NODE_ENV === 'development' ? { message: error.message } : undefined,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}