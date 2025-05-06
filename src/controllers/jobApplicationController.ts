import { Request, Response, NextFunction } from 'express';
import catchAsync from 'express-async-handler';
import {
    addQuestionToJobApplicationFormService,
    deleteQuestionFromJobApplicationService,
    getAllArchivedApplicationsOfUserService,
    getJobApplicationFormService,
    getJobApplicationByBusinessService,
    updateJobApplicationStateService,
    updateQuestionFromJobApplicationService,
    createJobApplicationFormService,
    applyToJobService,
    getAllJobApplicationsToJobService,
    deleteJobApplicationFormService,
    getAccountJobApplicationByIdService,
    getAllJobApplicationByAccountIdService,
    archiveJobApplicationService,
} from '../services/jobApplicationServices';

export const createJobApplicationForm = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.jobId);
            const userId = Number(req.user.id);
            const data = req.body;
            const jobApplicationFrom = await createJobApplicationFormService(
                userId,
                jobId,
                data,
            );
            res.status(201).json({
                success: true,
                message: 'JobApplicationForm created successfully',
                jobApplicationFrom,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getJobApplicationForm = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const jobId = Number(req.params.jobId);
            const jobApplicationForm =
                await getJobApplicationFormService(jobId);
            res.status(200).json({
                success: true,
                message: ' Job Application form fetched successfully',
                jobApplicationForm,
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

export const deleteJobApplicationForm = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const jobId = Number(req.params.jobId);

            await deleteJobApplicationFormService(accountId, jobId);
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const addJobApplicationFormQuestion = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const jobApplicationFormId = Number(
                req.params.jobApplicationFormId,
            );
            const question = await addQuestionToJobApplicationFormService(
                accountId,
                jobApplicationFormId,
                req.body,
            );

            res.status(201).json({
                success: true,
                question,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateJobApplicationFormQuestion = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const jobApplicationFormId = Number(
                req.params.jobApplicationFormId,
            );
            const questionId = req.params.questionId;
            const question = await updateQuestionFromJobApplicationService(
                accountId,
                jobApplicationFormId,
                questionId,
                req.body,
            );

            res.status(200).json({
                success: true,
                question,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteJobApplicationFormQuestion = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const jobApplicationFormId = Number(
                req.params.jobApplicationFormId,
            );
            const questionId = req.params.questionId;

            await deleteQuestionFromJobApplicationService(
                accountId,
                jobApplicationFormId,
                questionId,
            );

            res.status(204).json({});
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
