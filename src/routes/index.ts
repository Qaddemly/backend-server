import { Express } from 'express';
import authRouter from './authRoutes';
import profileRouter from './profileRoutes';

import { businessRouter } from './businessRoutes';
import app from '../app';
import { accountRouter } from './accountRoutes';
import jobRouter from './jobRoutes';
import { reviewRouter } from './reviewRoutes';
import statsRouter from './statsRoutes';

import { resumeTemplateRouter } from './resumeTemplateRoutes';
import { chatRouter } from './chatRoutes';

import notificationRouter from './notificationRoutes';
import coverLetterRouter from './coverLetterRoutes';

const mountRoutes = (app: Express) => {
    const prefixUrl = '/api/v1';
    app.use(prefixUrl + '/auth', authRouter);
    app.use(prefixUrl + '/user', profileRouter);
    app.use(prefixUrl + '/job', jobRouter);

    app.use(prefixUrl + '/chat', chatRouter);
    app.use('/api/v1/account', accountRouter);
    app.use('/api/v1/business', businessRouter);
    app.use('/api/v1/review', reviewRouter);
    app.use('/api/v1/stats', statsRouter);
    app.use('/api/v1/resumeTemplate', resumeTemplateRouter);
    app.use('/api/v1/notification', notificationRouter);
    app.use('/api/v1/coverLetter', coverLetterRouter);
};

export default mountRoutes;
