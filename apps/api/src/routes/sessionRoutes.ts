import { Router } from 'express';
import { getSessions, createSession, deleteSession } from '../controllers/sessionController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getSessions);
router.post('/', createSession);
router.delete('/:id', deleteSession);

export default router;
