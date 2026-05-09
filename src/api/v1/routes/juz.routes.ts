/* eslint-disable @typescript-eslint/no-misused-promises */
 
// src/api/v1/routes/juz.routes.ts
import { Router } from 'express';
import { JuzController } from '../controllers/juz.controller';


const router = Router();
const juzController = new JuzController();

router.get('/', juzController.getAllJuz);
router.get('/:id', juzController.getJuzById);

export default router;