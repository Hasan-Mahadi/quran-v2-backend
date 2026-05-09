"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const search_service_1 = require("../../../services/quran/search.service");
const response_util_1 = require("../../../utils/response.util");
class SearchController {
    constructor() {
        this.search = async (req, res) => {
            const query = req.query;
            const { results, total } = await this.searchService.search(query.q, query.type, query.language, query.page, query.limit);
            const paginationMeta = {
                currentPage: query.page,
                pageSize: query.limit,
                totalItems: total,
                totalPages: Math.ceil(total / query.limit),
                hasNext: query.page * query.limit < total,
                hasPrev: query.page > 1,
            };
            return response_util_1.ApiResponse.success(res, results, { pagination: paginationMeta });
        };
        this.getSearchStats = async (_req, res) => {
            const stats = this.searchService.getSearchStats();
            return response_util_1.ApiResponse.success(res, stats);
        };
        this.searchService = new search_service_1.SearchService();
    }
}
exports.SearchController = SearchController;
