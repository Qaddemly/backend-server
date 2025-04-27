import { Request, Response, NextFunction } from 'express';
import catchAsync from 'express-async-handler';
import {
    addQuestionToCustomJobApplicationService,
    archiveCustomJobApplicationSubmitService,
    createCustomJobApplicationService,
    createCustomJobApplicationSubmitService,
    deleteCustomJobApplicationService,
    deleteQuestionFromCustomJobApplicationService,
    getAllArchivedCustomApplicationsOfUserService,
    getAllCustomJobApplicationSubmitsByAccountIdService,
    getAllCustomJobApplicationSubmitsService,
    getCustomJobApplicationService,
    getCustomJobApplicationSubmitByBusinessService,
    getCustomJobApplicationSubmitByIdService,
    updateCustomJobApplicationSubmitStateService,
    updateQuestionFromCustomJobApplicationService,
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

export const createCustomJobApplicationSubmit = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const customJobApplicationId = Number(
                req.params.customJobApplicationId,
            );

            await createCustomJobApplicationSubmitService(
                accountId,
                customJobApplicationId,
                req.body,
            );
            res.status(201).json({
                success: true,
                message: 'congrats your application is submitted successfully',
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllCustomJobApplicationSubmits = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customJobApplicationSubmits =
                await getAllCustomJobApplicationSubmitsService(req);
            res.status(200).json({
                success: true,
                customJobApplicationSubmits,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getOneCustomJobApplicationSubmitByBusiness = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const customJobApplicationId = Number(
                req.params.customJobApplicationId,
            );
            const customJobApplicationSubmitId = Number(
                req.params.customJobApplicationSubmitId,
            );

            const customJobApplicationSubmit =
                await getCustomJobApplicationSubmitByBusinessService(
                    accountId,
                    customJobApplicationId,
                    customJobApplicationSubmitId,
                );
            res.status(200).json({
                success: true,
                customJobApplicationSubmit,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateCustomJobApplicationSubmitState = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const customJobApplicationId = Number(
                req.params.customJobApplicationId,
            );
            const customJobApplicationSubmitId = Number(
                req.params.customJobApplicationSubmitId,
            );
            const customJobApplicationSubmitState = req.body.state;

            await updateCustomJobApplicationSubmitStateService(
                accountId,
                customJobApplicationId,
                customJobApplicationSubmitId,
                customJobApplicationSubmitState,
            );
            res.status(200).json({
                success: true,
                message:
                    'Custom Job Application Submit state updated successfully',
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteCustomJobApplication = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const customJobApplicationId = Number(
                req.params.customJobApplicationId,
            );

            await deleteCustomJobApplicationService(
                accountId,
                customJobApplicationId,
            );
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const addCustomJobApplicationQuestion = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const customJobApplicationId = Number(
                req.params.customJobApplicationId,
            );
            const question = await addQuestionToCustomJobApplicationService(
                accountId,
                customJobApplicationId,
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

export const updateCustomJobApplicationQuestion = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const customJobApplicationId = Number(
                req.params.customJobApplicationId,
            );
            const questionId = req.params.questionId;
            const question =
                await updateQuestionFromCustomJobApplicationService(
                    accountId,
                    customJobApplicationId,
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

export const deleteCustomJobApplicationQuestion = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const customJobApplicationId = Number(
                req.params.customJobApplicationId,
            );
            const questionId = req.params.questionId;

            await deleteQuestionFromCustomJobApplicationService(
                accountId,
                customJobApplicationId,
                questionId,
            );

            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const getCustomJobApplicationSubmitById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const customJobApplicationId = Number(
                req.params.customJobApplicationId,
            );
            const customJobApplicationSubmitId = Number(
                req.params.customJobApplicationSubmitId,
            );

            const customJobApplicationSubmit =
                await getCustomJobApplicationSubmitByIdService(
                    accountId,
                    customJobApplicationId,
                    customJobApplicationSubmitId,
                );

            res.status(200).json({
                success: true,
                customJobApplicationSubmit,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllCustomJobApplicationSubmitsByAccountId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customJobApplicationSubmits =
                await getAllCustomJobApplicationSubmitsByAccountIdService(req);

            res.status(200).json({
                success: true,
                customJobApplicationSubmits,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllArchivedCustomJobApplicationSubmitsByAccountId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const customJobApplicationSubmitId = Number(
                req.params.customJobApplicationSubmitId,
            );
            const archive = req.query.archive;
            const customJobApplicationSubmits =
                await getAllArchivedCustomApplicationsOfUserService(accountId);

            res.status(200).json({
                success: true,
                customJobApplicationSubmits,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const archiveCustomJobApplicationSubmit = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const customJobApplicationSubmitId = Number(
                req.params.customJobApplicationSubmitId,
            );
            const archive = (req.query.archive as string) === 'true';

            const customJobApplicationSubmit =
                await archiveCustomJobApplicationSubmitService(
                    accountId,
                    customJobApplicationSubmitId,
                    archive as any,
                );

            res.status(200).json({
                success: true,
                customJobApplicationSubmit,
            });
        } catch (err) {
            return next(err);
        }
    },
);
