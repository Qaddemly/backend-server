import { Express } from 'express';
import authRouter from './authRoutes';
import { businessRouter } from './businessRoutes';
import app from '../app';
import { accountRouter } from './accountRoutes';

const mountRoutes = (app: Express) => {
    const prefixUrl = '/api/v1';
    app.use(prefixUrl + '/auth', authRouter);
    app.use('/api/v1/account', accountRouter);
    app.use('/api/v1/business', businessRouter);
};

export default mountRoutes;
