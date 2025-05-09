import { Request, Response, NextFunction } from 'express';
import catchAsync from 'express-async-handler';
import {
    getAllArchivedApplicationsOfUserService,
    getJobApplicationByBusinessService,
    updateJobApplicationStateService,
    applyToJobService,
    getAllJobApplicationsToJobService,
    getAccountJobApplicationByIdService,
    getAllJobApplicationByAccountIdService,
    archiveJobApplicationService,
    getJobApplicationFormQuestionsService,
    updateJobQuestionsService,
} from '../services/jobApplicationServices';

export const getJobApplicationForm = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.jobId);
            const questions =
                await getJobApplicationFormQuestionsService(jobId);
            res.status(200).json({
                success: true,
                message: ' Job questions fetched successfully',
                questions,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateJobApplicationsQuestions = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.jobId);
            const questions = await updateJobQuestionsService(jobId, req.body);
            res.status(200).json({
                success: true,
                message: ' Job questions fetched successfully',
                questions,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const applyToJob = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const jobId = Number(req.params.jobId);

            await applyToJobService(accountId, jobId, req.body);
            res.status(201).json({
                success: true,
                message: 'congrats your application is submitted successfully',
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
                await getAllJobApplicationsToJobService(req);
            res.status(200).json({
                success: true,
                jobApplications,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getOneJobApplicationByBusiness = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const jobApplicationId = Number(req.params.jobApplicationId);
            const jobId = Number(req.params.jobId);

            const jobApplication = await getJobApplicationByBusinessService(
                accountId,
                jobId,
                jobApplicationId,
            );
            res.status(200).json({
                success: true,
                jobApplication,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateJobApplicationState = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const jobId = Number(req.params.jobId);
            const jobApplicationId = Number(req.params.jobApplicationId);
            const jobApplicationState = req.body.state;

            await updateJobApplicationStateService(
                accountId,
                jobId,
                jobApplicationId,
                jobApplicationState,
            );
            res.status(200).json({
                success: true,
                message: ' Job Application state updated successfully',
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAccountJobApplicationById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const jobApplicationId = Number(req.params.jobApplicationId);

            const jobApplication = await getAccountJobApplicationByIdService(
                accountId,
                jobApplicationId,
            );

            res.status(200).json({
                success: true,
                jobApplication,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllJobApplicationsByAccountId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobApplications =
                await getAllJobApplicationByAccountIdService(req);

            res.status(200).json({
                success: true,
                jobApplications,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllArchivedJobApplicationsByAccountId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);

            const archivedJobApplications =
                await getAllArchivedApplicationsOfUserService(accountId);

            res.status(200).json({
                success: true,
                archivedJobApplications,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const archiveJobApplication = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const jobApplicationId = Number(req.params.jobApplicationId);
            const archive = (req.query.archive as string) === 'true';

            const jobApplication = await archiveJobApplicationService(
                accountId,
                jobApplicationId,
                archive as any,
            );

            res.status(200).json({
                success: true,
                jobApplication,
            });
        } catch (err) {
            return next(err);
        }
    },
);
