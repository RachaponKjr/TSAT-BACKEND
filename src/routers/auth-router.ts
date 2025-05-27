import express from 'express';
import { checkTokenStatus } from '../controllers/auth-controller';

const router = express.Router();

router.get('/check', checkTokenStatus);

export default router;
