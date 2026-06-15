import { Router } from 'express';
import { getSecretData } from '../controllers/resource.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Gắn Middleware bảo vệ trực tiếp vào Route này
router.get('/secret-data', verifyToken, getSecretData);

export default router;