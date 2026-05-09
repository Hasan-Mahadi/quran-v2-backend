/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ERROR_CODES, HTTP_STATUS } from "../constants/api.constants";

 



export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(
    code: string,
    message: string,
    statusCode: number = HTTP_STATUS.BAD_REQUEST,
    details?: any
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(ERROR_CODES.VALIDATION_ERROR, message, HTTP_STATUS.BAD_REQUEST, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(
      ERROR_CODES.RESOURCE_NOT_FOUND,
      `${resource} not found`,
      HTTP_STATUS.NOT_FOUND
    );
  }
}

export class BusinessError extends AppError {
  constructor(code: string, message: string, details?: any) {
    super(code, message, HTTP_STATUS.BAD_REQUEST, details);
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super(
      ERROR_CODES.RATE_LIMIT_EXCEEDED,
      'Too many requests, please try again later',
      HTTP_STATUS.TOO_MANY_REQUESTS
    );
  }
}