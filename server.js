const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const User = require("./db/users");

const port = process.env.PORT || 8080;
const app = express();
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://storedb-wyw9.onrender.com/auth/google/callback"
}, async(accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({
        googleId: profile.id
    })
    if (!user) {
        user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            role: "staff"
        });
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

app.get('/profile', (req, res) => {
    res.json({ user: req.user });
});

app.get("/logout", (req, res) => {
    req.logout(() => {
        res.redirect("/");
    });
});


app
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        next();
    })
    .use('/', require('./routes'));

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(port, () => {
            console.log(`Connected to MongoDB and Server is running on port ${port}`);
        });
    }
});