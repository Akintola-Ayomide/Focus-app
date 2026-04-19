import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, getCurrentUser, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getCurrentUser);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=true' }),
  (req, res) => {
    // We expect our custom Google Strategy to return an object with user and token
    const authData = req.user as { user: any, token: string };
    if (!authData || !authData.token) {
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=true`);
        return;
    }

    res.cookie('token', authData.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?success=true`);
  }
);

export default router;
