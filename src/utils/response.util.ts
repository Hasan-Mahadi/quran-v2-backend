/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
 

import { Response } from 'express';
import { HTTP_STATUS } from '../constants/api.constants';


export interface ApiResponseMeta {
  pagination?: PaginationMeta;
  timestamp: string;
  version: string;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    meta?: Partial<ApiResponseMeta>,
    statusCode: number = HTTP_STATUS.OK
  ): Response {
    return res.status(statusCode).json({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || 'v1',
        ...meta,
      },
    });
  }

  static error(
    res: Response,
    code: string,
    message: string,
    details?: any,
    statusCode: number = HTTP_STATUS.BAD_REQUEST
  ): Response {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
        path: res.req?.path,
      },
    });
  }

  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    additionalData?: any
  ): Response {
    return this.success(res, { items: data, ...additionalData }, { pagination });
  }
}