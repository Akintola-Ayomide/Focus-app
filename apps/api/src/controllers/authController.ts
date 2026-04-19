import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { generateToken } from '../config/jwt';
import { sendEmail } from '../lib/email';

export const register = async (req: Request, res: Response): Promise<void>  => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        verificationToken,
      },
    });

    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Verify your Focus Flow account',
      html: `<h2>Welcome to Focus Flow!</h2><p>Please verify your email by clicking the link below:</p><a href="${verifyUrl}">${verifyUrl}</a>`
    });

    const token = generateToken(user.id);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.status(201).json({
      message: 'Registered successfully. Please check your email to verify your account.',
      user: { id: user.id, email: user.email, name: user.name, isVerified: user.isVerified },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query;
  if (!token || typeof token !== 'string') {
    res.status(400).json({ error: 'Invalid token' });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired verification token' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, isVerified: user.isVerified },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't leak that user doesn't exist
      res.json({ message: 'If an account exists, a reset link has been sent.' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to set a new password:</p><a href="${resetUrl}">${resetUrl}</a><p>This link expires in 1 hour.</p>`
    });

    res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;
  
  if (!token || !password) {
    res.status(400).json({ error: 'Token and new password are required' });
    return;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() } // Must not be expired
      }
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      }
    });

    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.json({ message: 'Logged out successfully' });
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const userReq = req as any;
  if (!userReq.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userReq.user.id },
      select: { id: true, email: true, name: true, isVerified: true, createdAt: true },
    });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find user' });
  }
};
