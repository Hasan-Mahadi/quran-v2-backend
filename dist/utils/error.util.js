"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitError = exports.BusinessError = exports.NotFoundError = exports.ValidationError = exports.AppError = void 0;
const api_constants_1 = require("../constants/api.constants");
class AppError extends Error {
    constructor(code, message, statusCode = api_constants_1.HTTP_STATUS.BAD_REQUEST, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message, details) {
        super(api_constants_1.ERROR_CODES.VALIDATION_ERROR, message, api_constants_1.HTTP_STATUS.BAD_REQUEST, details);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(resource) {
        super(api_constants_1.ERROR_CODES.RESOURCE_NOT_FOUND, `${resource} not found`, api_constants_1.HTTP_STATUS.NOT_FOUND);
    }
}
exports.NotFoundError = NotFoundError;
class BusinessError extends AppError {
    constructor(code, message, details) {
        super(code, message, api_constants_1.HTTP_STATUS.BAD_REQUEST, details);
    }
}
exports.BusinessError = BusinessError;
class RateLimitError extends AppError {
    constructor() {
        super(api_constants_1.ERROR_CODES.RATE_LIMIT_EXCEEDED, 'Too many requests, please try again later', api_constants_1.HTTP_STATUS.TOO_MANY_REQUESTS);
    }
}
exports.RateLimitError = RateLimitError;
