import express, { Request, Response } from 'express';
import { ensureAuth, ensureGuest } from '../middleware/auth';

const router = express.Router();

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req: Request, res: Response) => {
    res.render('login', {
        layout: 'login',
    });
});

// @desc    Dashboard
// @route   GET /api-docs
router.get('/api-docs', ensureAuth, (req: Request, res: Response) => {
    console.log(req.user);
    res.render('api-docs', {
        name: req.user?.firstName,
    });
});

export default router;
