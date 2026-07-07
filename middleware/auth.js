const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.isAuthenticated()) {
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
    }
}; 