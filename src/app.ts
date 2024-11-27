import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import './utils/googlePassportConfig';

import expressSession from 'express-session';
import mongoConnectSessions from 'connect-mongodb-session';
const mongoStore = mongoConnectSessions(expressSession);
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { globalErrorHandler } from './middlewares/error.middleWare';
import mountRoutes from './routes';

const app = express();

app.use(cors());
app.options('*', cors());
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET!,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
        saveUninitialized: true,
        resave: false,
        store: new mongoStore({
            uri: process.env.DATABASE_URL!,
            collection: 'sessions',
        }),
    }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());

//mount Routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mountRoutes(app);
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: `cant find ${req.url}`,
    });
});

app.use(globalErrorHandler);

export default app;
