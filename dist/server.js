"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const express_handlebars_1 = require("express-handlebars");
const mongodb = __importStar(require("./db/connect"));
require('dotenv').config();
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.engine('.hbs', (0, express_handlebars_1.engine)({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
app.set('views', './views');
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
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
    }
    catch (err) {
        return done(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
app.set('trust proxy', 1);
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production'
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use('/', require('./routes/authindex'));
app.use('/auth', require('./routes/auth'));
app
    .use(body_parser_1.default.json())
    .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
    .use('/', require('./routes'))
    .use('/', require('./routes/authindex'));
mongodb.initDb((err, client) => {
    if (err) {
        console.error(err);
    }
    else {
        app.listen(port, () => {
            console.log(`Connected to MongoDB and Server is running on port ${port}`);
        });
    }
});
