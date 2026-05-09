"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchQuerySchema = void 0;
const zod_1 = require("zod");
const common_dto_1 = require("./common.dto");
exports.SearchQuerySchema = common_dto_1.PaginationQuerySchema.merge(zod_1.z.object({
    q: zod_1.z.string().min(2).max(100),
    type: zod_1.z.enum(['arabic', 'translation']).default('arabic'),
    language: zod_1.z.enum(['en', 'id', 'ar']).optional(),
}));
