import { Router } from 'express';
import { getJwks } from '../controllers/jwks.controller';

const router = Router();
router.get('/jwks.json', getJwks);
export default router;