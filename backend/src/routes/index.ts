import { Router } from 'express';
import healthRoutes from './health';

const router = Router();

// Mount all routes
router.use('/health', healthRoutes);

export default router;
