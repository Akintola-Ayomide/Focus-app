import { Request, Response } from 'express';

export const checkHealth = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is running smoothly!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};
