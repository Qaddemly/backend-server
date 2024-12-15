import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import {
    createUserOneExperienceService,
    deleteMeService,
    deleteUserOneExperienceService,
    updateUserOneExperienceService,
} from '../services/userService';
import catchAsync from 'express-async-handler';

export const deleteMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteMeService(req);
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const updateUserOneExperience = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const experience = await updateUserOneExperienceService(req);
            res.status(200).json({
                success: true,
                experience,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const createUserOneExperience = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const experience = await createUserOneExperienceService(req);
            res.status(201).json({
                success: true,
                experience,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteUserOneExperience = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteUserOneExperienceService(req);
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);
