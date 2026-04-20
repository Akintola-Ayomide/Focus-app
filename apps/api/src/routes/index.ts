import { Router } from 'express';
import healthRoutes from './health';
import authRoutes from './auth';
import sessionRoutes from './sessionRoutes';
import habitRoutes from './habitRoutes';

const router = Router();

// Mount all routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/sessions', sessionRoutes);
router.use('/habits', habitRoutes);

export default router;
