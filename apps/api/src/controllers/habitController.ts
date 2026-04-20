import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getHabits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        logs: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(habits);
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
};

export const createHabit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, color, icon } = req.body;

    const habit = await prisma.habit.create({
      data: {
        name,
        color,
        icon,
        userId,
      },
      include: {
        logs: true,
      },
    });

    res.status(201).json(habit);
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
};

export const toggleHabitToday = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: habitId } = req.params;
    const { completedDate } = req.body; // Expected format: YYYY-MM-DD

    if (!completedDate) {
      return res.status(400).json({ error: 'completedDate is required' });
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit || habit.userId !== userId) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const existingLog = await prisma.habitLog.findUnique({
      where: {
        habitId_completedDate: {
          habitId,
          completedDate,
        },
      },
    });

    if (existingLog) {
      await prisma.habitLog.delete({
        where: { id: existingLog.id },
      });
      return res.json({ message: 'Habit completion removed', status: 'uncompleted' });
    } else {
      await prisma.habitLog.create({
        data: {
          habitId,
          userId,
          completedDate,
        },
      });
      return res.json({ message: 'Habit completion added', status: 'completed' });
    }
  } catch (error) {
    console.error('Toggle habit error:', error);
    res.status(500).json({ error: 'Failed to toggle habit' });
  }
};

export const deleteHabit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const habit = await prisma.habit.findUnique({
      where: { id },
    });

    if (!habit || habit.userId !== userId) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    await prisma.habit.delete({
      where: { id },
    });

    res.json({ message: 'Habit deleted' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
};
