"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const api_constants_1 = require("../constants/api.constants");
class ApiResponse {
    static success(res, data, meta, statusCode = api_constants_1.HTTP_STATUS.OK) {
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
    static error(res, code, message, details, statusCode = api_constants_1.HTTP_STATUS.BAD_REQUEST) {
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
    static paginated(res, data, pagination, additionalData) {
        return this.success(res, { items: data, ...additionalData }, { pagination });
    }
}
exports.ApiResponse = ApiResponse;
