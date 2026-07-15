import { Request, Response, NextFunction } from 'express';

export const requireRole = (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!req.user || !allowedRoles.includes(req.user.Role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };

export const ensureAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
};

export const ensureGuest = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    res.redirect('/api-docs');
  } else {
    return next();
  }
};