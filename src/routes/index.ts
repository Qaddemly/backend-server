import { Express } from 'express';
import authRouter from './authRoutes';
import userRouter from './userRoutes';

const mountRoutes = (app: Express) => {
    const prefixUrl = '/api/v1';
    app.use(prefixUrl + '/auth', authRouter);
    app.use(prefixUrl + '/user', userRouter);
};

export default mountRoutes;
