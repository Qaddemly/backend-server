import { Request, Response, NextFunction } from 'express';

import catchAsync from 'express-async-handler';

import {
    createAwardContentService,
    deleteOneAwardContentService,
    getAllAwardsContentService,
    getOneAwardContentService,
    updateOneAwardContentService,
} from '../../services/resumeTemplateServices/resumeTemplateAwardServices';

export const createAwardContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const data = req.body;
            const awardContent = await createAwardContentService(
                resumeTemplateId,
                accountId,
                data,
            );
            res.status(201).json({
                success: true,
                message: 'awardContent created successfully',
                awardContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getOneAwardContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const awardContentId = Number(req.params.awardContentId);
            const awardContent = await getOneAwardContentService(
                resumeTemplateId,
                accountId,
                awardContentId,
            );
            res.status(200).json({
                success: true,
                awardContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllAwardsContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const awardsContent = await getAllAwardsContentService(
                resumeTemplateId,
                accountId,
            );
            res.status(200).json({
                success: true,
                awardsContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateOneAwardContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const awardContentId = Number(req.params.awardContentId);
            const data = req.body;
            const awardContent = await updateOneAwardContentService(
                resumeTemplateId,
                accountId,
                awardContentId,
                data,
            );
            res.status(200).json({
                success: true,
                message: 'awardContent updated successfully',
                awardContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteOneAwardContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const awardContentId = Number(req.params.awardContentId);
            await deleteOneAwardContentService(
                resumeTemplateId,
                accountId,
                awardContentId,
            );
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);
