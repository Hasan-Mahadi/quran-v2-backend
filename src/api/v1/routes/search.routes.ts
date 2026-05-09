/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { SearchQuerySchema } from '../dto/search.dto';
import z from 'zod';

const router = Router();
const searchController = new SearchController();

router.get(
  '/',
  ValidationMiddleware.validate(
    z.object({
      query: SearchQuerySchema,
    })
  ),
  searchController.search
);

router.get('/stats', searchController.getSearchStats);

export default router;