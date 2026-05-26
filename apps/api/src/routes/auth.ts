import { Router } from 'express';
import passport from 'passport';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getCurrentUser, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.get('/me', authenticate, getCurrentUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=true' }),
  (req: any, res: any) => {
    // We expect our custom Google Strategy to return an object with user and token
    const authData = req.user as { user: any, token: string };
    if (!authData || !authData.token) {
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=true`);
        return;
    }

    res.cookie('token', authData.token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${authData.token}`);
  }
);

export default router;
