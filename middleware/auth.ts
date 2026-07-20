import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppJwtPayload } from '../types/models';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

interface SignableUser {
  _id: unknown;
  UserName: string;
  email: string;
  Role: string;
}

// Mints a JWT for an authenticated (session) user, to be used as a Bearer token against the API.
const signToken = (user: SignableUser): string => {
    return jwt.sign(
        {
            id: user._id,
            UserName: user.UserName,
            email: user.email,
            Role: user.Role,
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Verifies the Authorization: Bearer <token> header and attaches the decoded payload to req.user.
const requireJWT = (req: Request, res: Response, next: NextFunction): void => {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) {
        res.status(401).json({ error: 'Missing or invalid Authorization header' });
        return;
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET) as unknown as AppJwtPayload;
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
    }
    next();
};

// Must run after requireJWT so req.user is populated.
const requireRole = (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }
    if (!req.user.Role || !allowedRoles.includes(req.user.Role)) {
        res.status(403).json({ error: 'Forbidden: insufficient role' });
        return;
    }
    next();
};

const ensureAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    res.redirect('/');
};

const ensureGuest = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isAuthenticated()) {
        res.redirect('/api-docs');
        return;
    }
    next();
};

export {
    ensureAuth,
    ensureGuest,
    signToken,
    requireJWT,
    requireRole,
};
