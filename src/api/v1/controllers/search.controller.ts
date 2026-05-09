/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/api/v1/controllers/search.controller.ts
import { Request, Response } from 'express';
import { SearchService } from '@/services/quran/search.service';
import { ApiResponse, PaginationMeta } from '@/utils/response.util';
import { SearchQueryDTO } from '../dto/search.dto';


export class SearchController {
  private searchService: SearchService;

  constructor() {
    this.searchService = new SearchService();
  }

  search = async (req: Request, res: Response): Promise<Response> => {
    const query = req.query as unknown as SearchQueryDTO;

    const { results, total } = await this.searchService.search(
      query.q,
      query.type,
      query.language,
      query.page,
      query.limit
    );

    const paginationMeta: PaginationMeta = {
      currentPage: query.page,
      pageSize: query.limit,
      totalItems: total,
      totalPages: Math.ceil(total / query.limit),
      hasNext: query.page * query.limit < total,
      hasPrev: query.page > 1,
    };

    return ApiResponse.success(res, results, { pagination: paginationMeta });
  };

  getSearchStats = async (_req: Request, res: Response): Promise<Response> => {
    const stats = this.searchService.getSearchStats();
    return ApiResponse.success(res, stats);
  };
}