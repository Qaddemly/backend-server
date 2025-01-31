import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import {
    applyToJobService,
    changeJobStatus,
    createJobService,
    getAllJobsApplicationsForJobService,
    getAllJobsSearchWithFilterService,
    getAllUserJobsApplicationsService,
    getAllUserSavedJobsService,
    getOneJobService,
    removeSavedJobFromUserService,
    saveJobToUserService,
    updateJobService,
} from '../services/jobServices';
import catchAsync from 'express-async-handler';
import { CreateJobBodyBTO } from '../dtos/jobDto';
import { JobStatus } from '../enums/jobStatus';

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

export const makeJobOpened = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const savedJobs = await changeJobStatus(req, JobStatus.OPENED);
            res.status(200).json({
                success: true,
                message: 'job Opened successfully',
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const makeJobClosed = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const savedJobs = await changeJobStatus(req, JobStatus.CLOSED);
            res.status(200).json({
                success: true,
                message: 'job closed successfully',
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const makeJobArchived = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const savedJobs = await changeJobStatus(req, JobStatus.ARCHIVED);
            res.status(200).json({
                success: true,
                message: 'job archived successfully',
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const saveJobToUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const savedJobs = await saveJobToUserService(req);
            res.status(200).json({
                success: true,
                message: 'job saved successfully',
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
                message: 'job unsaved successfully',
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

export const applyToJob = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobApplication = await applyToJobService(req);
            res.status(200).json({
                success: true,
                jobApplication,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllUserJobApplications = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobApplications =
                await getAllUserJobsApplicationsService(req);
            res.status(200).json({
                success: true,
                jobApplications,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllJobApplicationsToJob = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobApplications =
                await getAllJobsApplicationsForJobService(req);
            res.status(200).json({
                success: true,
                jobApplications: jobApplications,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllJobs = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobs = await getAllJobsSearchWithFilterService(req);
            res.status(200).json({
                success: true,
                jobs,
            });
        } catch (err) {
            return next(err);
        }
    },
);
