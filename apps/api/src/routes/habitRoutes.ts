import { Router } from 'express';
import { getHabits, createHabit, toggleHabitToday, deleteHabit } from '../controllers/habitController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getHabits);
router.post('/', createHabit);
router.post('/:id/toggle', toggleHabitToday);
router.delete('/:id', deleteHabit);

export default router;
