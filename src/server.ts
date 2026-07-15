import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { engine } from 'express-handlebars';
import * as mongodb from './db/connect';
import { MongoClient } from 'mongodb';

require('dotenv').config();

const port = process.env.PORT || 8080;
const app = express();

app.engine('.hbs', engine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
app.set('views', './views');

interface AppUser {
  _id?: unknown;
  googleId: string;
  UserName: string;
  DisplayName: string;
  email: string;
  Role: string;
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "/auth/google/callback"
}, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
        const users = mongodb.getDb().db().collection<AppUser>('Users');
        let user = await users.findOne({ googleId: profile.id });

        if (!user) {
            const result = await users.insertOne({
                googleId: profile.id,
                UserName: profile.displayName,
                DisplayName: profile.displayName,
                email: profile.emails![0].value,
                Role: "staff"
            });
            user = {
                _id: result.insertedId,
                googleId: profile.id,
                UserName: profile.displayName,
                DisplayName: profile.displayName,
                email: profile.emails![0].value,
                Role: "staff"
            };
        }

        return done(null, user);
    } catch (err) {
        return done(err as Error);
    }
}));

passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done: (err: any, user?: Express.User | false | null) => void) => {
    done(null, user);
});

app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/authindex'));
app.use('/auth', require('./routes/auth'));

app
    .use(bodyParser.json())
    .use((req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        next();
    })
    .use('/', require('./routes'))
    .use('/', require('./routes/authindex'));

mongodb.initDb((err: Error | null, client?: MongoClient) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(port, () => {
            console.log(`Connected to MongoDB and Server is running on port ${port}`);
        });
    }
});