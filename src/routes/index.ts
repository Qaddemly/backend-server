import { Express } from 'express';
import authRouter from './authRoutes';
import profileRouter from './profileRoutes';

const mountRoutes = (app: Express) => {
    const prefixUrl = '/api/v1';
    app.use(prefixUrl + '/auth', authRouter);
    app.use(prefixUrl + '/user', profileRouter);
};

export default mountRoutes;
