import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ensureAuth, signToken } from '../middleware/auth';

const router = express.Router();

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
(req: Request, res: Response) => {
    res.redirect('/api-docs');
});

// @desc    Get a JWT for the current session, for use as a Bearer token in Swagger/API testing
// @route   GET /auth/token
router.get('/token', ensureAuth, (req: Request, res: Response) => {
    const token = signToken(req.user as any);
    res.json({ token });
});

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

export default router;
