/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiResponse } from '../../../utils/response.util';


export class ValidationMiddleware {
  static validate(schema: AnyZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validatedData = await schema.parseAsync({
          params: req.params,
          query: req.query,
          body: req.body,
        });

        req.params = validatedData.params || req.params;
        req.query = validatedData.query || req.query;
        req.body = validatedData.body || req.body;

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const details = error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));

          return ApiResponse.error(
            res,
            'VALIDATION_ERROR',
            'Request validation failed',
            details,
            400
          );
        }
        next(error);
      }
    };
  }
}