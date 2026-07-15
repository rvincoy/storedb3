const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

// Mints a JWT for an authenticated (session) user, to be used as a Bearer token against the API.
const signToken = (user) => {
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
const requireJWT = (req, res, next) => {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    try {
        req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    next();
};

// Must run after requireJWT so req.user is populated.
const requireRole = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.Role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
};

module.exports = {
    ensureAuth: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    },
    ensureGuest: function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/api-docs');
        } else {
            return next();
        }
    },
    signToken,
    requireJWT,
    requireRole,
};
