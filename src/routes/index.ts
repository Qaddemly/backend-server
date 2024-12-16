import { Express } from 'express';
import authRouter from './authRoutes';
import profileRouter from './profileRoutes';
import { businessRoute } from './businessRoutes';

const mountRoutes = (app: Express) => {
    const prefixUrl = '/api/v1';
    app.use(prefixUrl + '/auth', authRouter);
    app.use(prefixUrl + '/user', profileRouter);
    app.use('/api/v1/business', businessRoute);
};

export default mountRoutes;
