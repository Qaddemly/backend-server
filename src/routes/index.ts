import { Express } from 'express';
import authRouter from './authRoutes';
import profileRouter from './profileRoutes';

import { businessRouter } from './businessRoutes';
import app from '../app';
import { accountRouter } from './accountRoutes';
import jobRouter from './jobRoutes';
import { reviewRouter } from './reviewRoutes';
import statsRouter from './statsRoutes';

const mountRoutes = (app: Express) => {
    const prefixUrl = '/api/v1';
    app.use(prefixUrl + '/auth', authRouter);
    app.use(prefixUrl + '/user', profileRouter);
    app.use(prefixUrl + '/job', jobRouter);

    app.use('/api/v1/account', accountRouter);
    app.use('/api/v1/business', businessRouter);
    app.use('/api/v1/review', reviewRouter);
    app.use('/api/v1/stats', statsRouter);
};

export default mountRoutes;
