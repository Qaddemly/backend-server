import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import {
    createJobService,
    getAllUserSavedJobsService,
    getOneJobService,
    removeSavedJobFromUserService,
    saveJobToUserService,
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

export const saveJobToUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await saveJobToUserService(req);
            res.status(200).json({
                success: true,
                user,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const unSaveJobFromUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await removeSavedJobFromUserService(req);
            res.status(200).json({
                success: true,
                user,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllUserSavedJobs = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const savedJobs = await getAllUserSavedJobsService(req);
            res.status(200).json({
                success: true,
                savedJobs,
            });
        } catch (err) {
            return next(err);
        }
    },
);
