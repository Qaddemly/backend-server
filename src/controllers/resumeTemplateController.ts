import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

import catchAsync from 'express-async-handler';
import {
    createPersonalInfoContentService,
    deleteOnePersonalInfoContentService,
    getOnePersonalInfoContentService,
    updateOnePersonalInfoContentService,
} from '../services/resumeTemplateServices/resumeTemplatePersonalInfoServices';

export const createPersonaInfoContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const data = req.body;
            const personaInfoContent = await createPersonalInfoContentService(
                resumeTemplateId,
                accountId,

                data,
            );
            res.status(201).json({
                success: true,
                message: 'personalInfoContent created successfully',
                personaInfoContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getOnePersonaInfoContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const personaInfoContentId = Number(
                req.params.personaInfoContentId,
            );
            const personaInfoContent = await getOnePersonalInfoContentService(
                resumeTemplateId,
                accountId,
                personaInfoContentId,
            );
            res.status(200).json({
                success: true,
                personaInfoContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateOnePersonaInfoContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const personaInfoContentId = Number(
                req.params.personaInfoContentId,
            );
            const data = req.body;
            const personaInfoContent =
                await updateOnePersonalInfoContentService(
                    resumeTemplateId,
                    accountId,
                    personaInfoContentId,
                    data,
                );
            res.status(200).json({
                success: true,
                message: 'personalInfoContent updated successfully',
                personaInfoContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteOnePersonaInfoContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const personaInfoContentId = Number(
                req.params.personaInfoContentId,
            );
            await deleteOnePersonalInfoContentService(
                resumeTemplateId,
                accountId,
                personaInfoContentId,
            );
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);
