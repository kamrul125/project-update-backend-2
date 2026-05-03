import { Router } from 'express';
import * as aiController from './ai.controller';

const router = Router();

router.get('/suggestions', aiController.getSearchSuggestions);
router.post('/chat', aiController.chat);

export default router;