import { Request, Response, NextFunction } from 'express';
import catchAsync from 'express-async-handler';
import {
    createCustomJobApplicationService,
    getCustomJobApplicationService,
} from '../services/customJobApplicationServices';

export const createCustomJobApplication = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.jobId);
            const userId = Number(req.user.id);
            const data = req.body;
            const customJobApplication =
                await createCustomJobApplicationService(userId, jobId, data);
            res.status(201).json({
                success: true,
                message: 'JobApplication created successfully',
                customJobApplication,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getCustomJobApplication = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.jobId);
            const customJobApplication =
                await getCustomJobApplicationService(jobId);
            res.status(200).json({
                success: true,
                message: 'Custom Job Application fetched successfully',
                customJobApplication,
            });
        } catch (err) {
            return next(err);
        }
    },
);
