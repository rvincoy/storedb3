const express = require('express');
const passport = require('passport');
const router = express.Router();
const { ensureAuth, signToken } = require('../middleware/auth');

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), 
(req, res) => {
    res.redirect('/api-docs');
});

// @desc    Get a JWT for the current session, for use as a Bearer token in Swagger/API testing
// @route   GET /auth/token
router.get('/token', ensureAuth, (req, res) => {
    const token = signToken(req.user);
    res.json({ token });
});

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;