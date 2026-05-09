"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlerMiddleware = void 0;
const logger_util_1 = require("../../../utils/logger.util");
const response_util_1 = require("../../../utils/response.util");
const error_util_1 = require("../../../utils/error.util");
const api_constants_1 = require("../../../constants/api.constants");
class ErrorHandlerMiddleware {
    static handle(error, req, res, _next) {
        logger_util_1.LoggerUtil.error('Unhandled error', error, {
            path: req.path,
            method: req.method,
            ip: req.ip,
        });
        if (error instanceof error_util_1.AppError) {
            return response_util_1.ApiResponse.error(res, error.code, error.message, process.env.NODE_ENV === 'development' ? error.details : undefined, error.statusCode);
        }
        // Handle unknown errors
        return response_util_1.ApiResponse.error(res, 'INTERNAL_SERVER_ERROR', 'An unexpected error occurred', process.env.NODE_ENV === 'development' ? { message: error.message } : undefined, api_constants_1.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
}
exports.ErrorHandlerMiddleware = ErrorHandlerMiddleware;
