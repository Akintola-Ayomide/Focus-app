import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getHabits = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
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

export const createHabit = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
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

export const toggleHabitToday = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const habitId = req.params.id as string;
    const { completedDate } = req.body; // Expected format: YYYY-MM-DD

    if (!completedDate) {
      res.status(400).json({ error: 'completedDate is required' });
      return;
    }

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit || habit.userId !== userId) {
      res.status(404).json({ error: 'Habit not found' });
      return;
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
      res.json({ message: 'Habit completion removed', status: 'uncompleted' });
      return;
    } else {
      await prisma.habitLog.create({
        data: {
          habitId,
          userId,
          completedDate,
        },
      });
      res.json({ message: 'Habit completion added', status: 'completed' });
      return;
    }
  } catch (error) {
    console.error('Toggle habit error:', error);
    res.status(500).json({ error: 'Failed to toggle habit' });
  }
};

export const deleteHabit = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const id = req.params.id as string;

    const habit = await prisma.habit.findUnique({
      where: { id },
    });

    if (!habit || habit.userId !== userId) {
      res.status(404).json({ error: 'Habit not found' });
      return;
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
