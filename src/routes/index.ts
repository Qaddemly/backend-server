import { Express } from 'express';
import authRouter from './authRoutes';
import { businessRoute } from './businessRoutes';
import app from '../app';

const mountRoutes = (app: Express) => {
    const prefixUrl = '/api/v1';
    app.use(prefixUrl + '/auth', authRouter);
    app.use('/api/v1/business', businessRoute);
};

export default mountRoutes;
