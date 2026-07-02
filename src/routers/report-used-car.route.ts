import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth-admin';
import { openReportController } from '../controllers/report-used-car.controller';

const route = Router();

route.post('/open-report', authenticateToken, openReportController);

export default route;
