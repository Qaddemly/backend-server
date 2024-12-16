import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import {
    createJobService,
    getOneJobService,
    updateJobService,
} from '../services/jobServices';
import catchAsync from 'express-async-handler';
import { CreateJobBodyBTO } from '../dtos/jobDto';

export const createJob = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const job = await createJobService(req);
            res.status(201).json({
                success: true,
                message: 'job created successfully',
                job,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getOneJob = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const job = await getOneJobService(req);
            res.status(200).json({
                success: true,
                job,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateOneJob = catchAsync(
    async (
        req: Request<{ id: string }, {}, CreateJobBodyBTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const job = await updateJobService(req);
            res.status(200).json({
                success: true,
                job,
            });
        } catch (err) {
            return next(err);
        }
    },
);
