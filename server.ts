import express from 'express';
import bodyParser from 'body-parser';
import * as mongodb from './db/connect';
import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import session from 'express-session';
import { engine as hbsEngine } from 'express-handlebars';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { User } from './types/models';
import authIndexRoutes from './routes/authindex';
import authRoutes from './routes/auth';
import routes from './routes';

const port = process.env.PORT || 8080;
const app = express();

app.engine('.hbs', hbsEngine({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
app.set('views', './views');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback'
}, async (accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user?: Express.User | false) => void) => {
    try {
        const users = mongodb.getDb().db().collection<User>('Users');
        let user = await users.findOne({ googleId: profile.id });

        if (!user) {
            const result = await users.insertOne({
                googleId: profile.id,
                UserName: profile.displayName,
                DisplayName: profile.displayName,
                email: profile.emails![0].value,
                Role: 'staff'
            });
            user = {
                _id: result.insertedId,
                googleId: profile.id,
                UserName: profile.displayName,
                DisplayName: profile.displayName,
                email: profile.emails![0].value,
                Role: 'staff'
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

passport.deserializeUser((user: Express.User, done) => {
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

app.use('/', authIndexRoutes);
app.use('/auth', authRoutes);

app
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        next();
    })
    .use('/', routes)
    .use('/', authIndexRoutes);

mongodb.initDb((err) => {
    if (err) {
        console.error(err);
    } else {
        app.listen(port, () => {
            console.log(`Connected to MongoDB and Server is running on port ${port}`);
        });
    }
});
