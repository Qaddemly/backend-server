import { Request, Response, NextFunction } from 'express';

import catchAsync from 'express-async-handler';

import {
    createEducationContentService,
    deleteOneEducationContentService,
    getAllEducationsContentService,
    getOneEducationContentService,
    updateOneEducationContentService,
} from '../../services/resumeTemplateServices/resumeTemplateEducationServices';

export const createEducationContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const data = req.body;
            const educationContent = await createEducationContentService(
                resumeTemplateId,
                accountId,
                data,
            );
            res.status(201).json({
                success: true,
                message: 'educationContent created successfully',
                educationContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getOneEducationContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const educationContentId = Number(req.params.educationContentId);
            const educationContent = await getOneEducationContentService(
                resumeTemplateId,
                accountId,
                educationContentId,
            );
            res.status(200).json({
                success: true,
                educationContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllEducationsContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const educationsContent = await getAllEducationsContentService(
                resumeTemplateId,
                accountId,
            );
            res.status(200).json({
                success: true,
                educationsContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateOneEducationContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const educationContentId = Number(req.params.educationContentId);
            const data = req.body;
            const educationContent = await updateOneEducationContentService(
                resumeTemplateId,
                accountId,
                educationContentId,
                data,
            );
            res.status(200).json({
                success: true,
                message: 'educationContent updated successfully',
                educationContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteOneEducationContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const educationContentId = Number(req.params.educationContentId);
            await deleteOneEducationContentService(
                resumeTemplateId,
                accountId,
                educationContentId,
            );
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);
