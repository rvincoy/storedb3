const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');

const port = process.env.PORT || 8080;
const app = express();
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const exphbs = require('express-handlebars');

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
app.set('views', './views');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://storedb-wyw9.onrender.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const users = mongodb.getDb().db().collection('Users');
        let user = await users.findOne({ googleId: profile.id });

        if (!user) {
            const result = await users.insertOne({
                googleId: profile.id,
                UserName: profile.displayName,
                DisplayName: profile.displayName,
                email: profile.emails[0].value,
                Role: "staff"
            });
            user = {
                _id: result.insertedId,
                googleId: profile.id,
                UserName: profile.displayName,
                DisplayName: profile.displayName,
                email: profile.emails[0].value,
                Role: "staff"
            };
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
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

app.use('/', require('./routes/authindex'));
app.use('/auth', require('./routes/auth'));

app
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        next();
    })
    .use('/', require('./routes'))
    .use('/', require('./routes/authindex'));

mongodb.initDb((err, mongodb) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(port, () => {
            console.log(`Connected to MongoDB and Server is running on port ${port}`);
        });
    }
});