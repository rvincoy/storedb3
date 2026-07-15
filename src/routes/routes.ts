import express, { Request, Response } from 'express';
import { ensureAuth, ensureGuest } from '../middleware/auth';

const router = express.Router();

router.get('/', ensureGuest, (req: Request, res: Response) => {
  res.render('login', {
    layout: 'login',
  });
});

router.get('/api-docs', ensureAuth, (req: Request, res: Response) => {
  console.log(req.user);
  res.render('api-docs', {
    name: req.user?.DisplayName,
  });
});

export = router;