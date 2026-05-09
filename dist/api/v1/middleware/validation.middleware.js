"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMiddleware = void 0;
const zod_1 = require("zod");
const response_util_1 = require("../../../utils/response.util");
class ValidationMiddleware {
    static validate(schema) {
        return async (req, res, next) => {
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
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    const details = error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    }));
                    return response_util_1.ApiResponse.error(res, 'VALIDATION_ERROR', 'Request validation failed', details, 400);
                }
                next(error);
            }
        };
    }
}
exports.ValidationMiddleware = ValidationMiddleware;
