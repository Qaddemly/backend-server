import { Request, Response, NextFunction } from 'express';

import catchAsync from 'express-async-handler';

import {
    createPublicationContentService,
    deleteOnePublicationContentService,
    getAllPublicationsContentService,
    getOnePublicationContentService,
    updateOnePublicationContentService,
} from '../../services/resumeTemplateServices/resumeTemplatePublicationServices';

export const createPublicationContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const data = req.body;
            const publicationContent = await createPublicationContentService(
                resumeTemplateId,
                accountId,
                data,
            );
            res.status(201).json({
                success: true,
                message: 'publicationContent created successfully',
                publicationContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getOnePublicationContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const publicationContentId = Number(
                req.params.publicationContentId,
            );
            const publicationContent = await getOnePublicationContentService(
                resumeTemplateId,
                accountId,
                publicationContentId,
            );
            res.status(200).json({
                success: true,
                publicationContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllPublicationsContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const publicationsContent = await getAllPublicationsContentService(
                resumeTemplateId,
                accountId,
            );
            res.status(200).json({
                success: true,
                publicationsContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateOnePublicationContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const publicationContentId = Number(
                req.params.publicationContentId,
            );
            const data = req.body;
            const publicationContent = await updateOnePublicationContentService(
                resumeTemplateId,
                accountId,
                publicationContentId,
                data,
            );
            res.status(200).json({
                success: true,
                message: 'publicationContent updated successfully',
                publicationContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteOnePublicationContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const publicationContentId = Number(
                req.params.publicationContentId,
            );
            await deleteOnePublicationContentService(
                resumeTemplateId,
                accountId,
                publicationContentId,
            );
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);
