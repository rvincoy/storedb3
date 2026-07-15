"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureGuest = exports.ensureAuth = exports.requireRole = void 0;
const requireRole = (...allowedRoles) => (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!req.user || !allowedRoles.includes(req.user.Role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
};
exports.requireRole = requireRole;
const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/');
    }
};
exports.ensureAuth = ensureAuth;
const ensureGuest = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect('/api-docs');
    }
    else {
        return next();
    }
};
exports.ensureGuest = ensureGuest;
