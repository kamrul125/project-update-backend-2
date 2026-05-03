import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import protect from '../../../middlewares/auth.middleware';

const router = Router();

router.get('/overview', protect('ADMIN'), dashboardController.getOverview);
router.get('/charts', protect('ADMIN'), dashboardController.getCharts);
router.get('/users', protect('ADMIN'), dashboardController.getUserMetrics);

export default router;