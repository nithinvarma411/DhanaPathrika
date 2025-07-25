import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/db.js';
import express from 'express';
import cron from 'node-cron';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    })
}));
app.use(passport.initialize());
app.use(passport.session());

import { authenticate } from '../src/middleware/auth.middleware.js';
import userRouter from '../src/routes/user.routes.js';
import stockRouter from '../src/routes/stock.routes.js';
import invoiceRouter from '../src/routes/invoice.routes.js';
import profileRouter from '../src/routes/profile.routes.js';
import resetpassRouter from '../src/routes/resetpass.router.js';
import verifyRouter from '../src/routes/verify.routes.js';

app.use("/api/v1/user", userRouter);
app.use("/api/v1/reset", resetpassRouter);
app.use("/api/v1/verify", verifyRouter);
app.use("/api/v1/stock", authenticate, stockRouter);
app.use("/api/v1/invoice", authenticate, invoiceRouter);
app.use("/api/v1/profile", authenticate, profileRouter);

// Google OAuth routes
import { googleAuth, googleAuthCallback, googleAuthSuccess } from '../src/controllers/user.controller.js';

app.get("/", (req, res) => {
    res.send('api working')
})
app.get("/auth/google", googleAuth);
app.get("/auth/google/callback", googleAuthCallback, googleAuthSuccess);

cron.schedule('*/10 * * * *', () => {
    axios.get(process.env.BACKEND_URL)
        .then(() => console.log('✅ Pinged self to stay awake'))
        .catch(err => console.error('❌ Ping failed:', err.message));
});

connectDB()
    .then(() => {
        app.listen(4444, () => {
            console.log("App running on port 4444");
        });
    })
    .catch((err) => {
        console.log(err);
    });
