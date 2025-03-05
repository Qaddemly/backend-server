import { Request, Response, NextFunction } from 'express';

import catchAsync from 'express-async-handler';
import {
    createPersonalInfoContentService,
    deleteOnePersonalInfoContentService,
    getOnePersonalInfoContentService,
    updateOnePersonalInfoContentService,
} from '../../services/resumeTemplateServices/resumeTemplatePersonalInfoServices';
import {
    createSkillContentService,
    deleteOneSkillContentService,
    getAllSkillsContentService,
    getOneSkillContentService,
    updateOneSkillContentService,
} from '../../services/resumeTemplateServices/resumeTemplateSkillServices';

export const createSkillContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const data = req.body;
            const skillContent = await createSkillContentService(
                resumeTemplateId,
                accountId,
                data,
            );
            res.status(201).json({
                success: true,
                message: 'skillContent created successfully',
                skillContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getOneSkillContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const skillContentId = Number(req.params.skillContentId);
            const skillContent = await getOneSkillContentService(
                resumeTemplateId,
                accountId,
                skillContentId,
            );
            res.status(200).json({
                success: true,
                skillContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllSkillsContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const skillsContent = await getAllSkillsContentService(
                resumeTemplateId,
                accountId,
            );
            res.status(200).json({
                success: true,
                skillsContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const updateOneSkillContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const skillContentId = Number(req.params.skillContentId);
            const data = req.body;
            const skillContent = await updateOneSkillContentService(
                resumeTemplateId,
                accountId,
                skillContentId,
                data,
            );
            res.status(200).json({
                success: true,
                message: 'skillContent updated successfully',
                skillContent,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteOneSkillContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = req.user.id;
            const resumeTemplateId = Number(req.params.resumeTemplateId);
            const skillContentId = Number(req.params.skillContentId);
            await deleteOneSkillContentService(
                resumeTemplateId,
                accountId,
                skillContentId,
            );
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);
