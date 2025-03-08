import { Request, Response, NextFunction } from 'express';

import catchAsync from 'express-async-handler';

import {
    createProjectContentService,
    deleteOneProjectContentService,
    getAllProjectsContentService,
    getOneProjectContentService,
    updateOneProjectContentService,
} from '../../services/resumeTemplateServices/resumeTemplateProjectServices';

export const createProjectContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const data = req.body;
            const projectContent = await createProjectContentService(
                resumeTemplateId,
                accountId,
                data,
            );
            res.status(201).json({
                success: true,
                message: 'projectContent created successfully',
                projectContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getOneProjectContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const projectContentId = Number(req.params.projectContentId);
            const projectContent = await getOneProjectContentService(
                resumeTemplateId,
                accountId,
                projectContentId,
            );
            res.status(200).json({
                success: true,
                projectContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllProjectsContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const projectsContent = await getAllProjectsContentService(
                resumeTemplateId,
                accountId,
            );
            res.status(200).json({
                success: true,
                projectsContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateOneProjectContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const projectContentId = Number(req.params.projectContentId);
            const data = req.body;
            const projectContent = await updateOneProjectContentService(
                resumeTemplateId,
                accountId,
                projectContentId,
                data,
            );
            res.status(200).json({
                success: true,
                message: 'projectContent updated successfully',
                projectContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteOneProjectContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const projectContentId = Number(req.params.projectContentId);
            await deleteOneProjectContentService(
                resumeTemplateId,
                accountId,
                projectContentId,
            );
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);
