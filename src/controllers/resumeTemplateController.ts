import { NextFunction, Request, Response } from 'express';
import { ResumeTemplateRepository } from '../Repository/ResumeTemplate/resumeTemplateRepository';
import { resumeTemplateRouter } from '../routes/resumeTemplateRoutes';
import catchAsync from 'express-async-handler';
import * as resumeTemplateService from '../services/resumeTemplateService';
import { createOrUpdateResumeExperienceDto } from '../dtos/resumeTemplateDto';

export const isUserOwnsThisResume = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId: number = req.user.id;
        const resumeTemplateId: number = Number(req.params.id);
        const resumeTemplate = await ResumeTemplateRepository.findOneBy({
            account_id: userId,
            id: resumeTemplateId,
        });
        if (!resumeTemplate) {
            res.status(403).json({
                status: 'fail',
                message: 'Not authorized to access this resume',
            });
            return;
        }
        next();
    },
);

export const getAllResumeTemplatesOfUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const allResumeTemplates =
            await resumeTemplateService.getAllResumeTemplatesOfUser(
                req.user.id,
            );
        res.status(200).json({
            status: 'success',
            data: allResumeTemplates,
        });
    },
);
export const getResumeTemplatesById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const resumeTemplate =
            await resumeTemplateService.getResumeTemplatesById(
                req.user.id,
                Number(req.params.id),
            );
        res.status(200).json({
            status: 'success',
            data: resumeTemplate,
        });
    },
);
export const createResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const resumeTemplate = await resumeTemplateService.createResumeTemplate(
            req.user.id,
            req.body,
        );
        res.status(201).json({
            status: 'success',
            data: resumeTemplate,
        });
    },
);
export const deleteResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await resumeTemplateService.deleteResumeTemplate(
            req.user.id,
            Number(req.params.id),
        );
        res.status(200).json({
            status: 'success',
            data: null,
        });
    },
);
export const updateProfileOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const resumeTemplate =
            await resumeTemplateService.updateProfileOfResumeTemplate(
                req.user.id,
                Number(req.params.id),
                req.body.profile,
            );
        res.status(200).json({
            status: 'success',
            data: resumeTemplate,
        });
    },
);
export const createExperienceOfResumeTemplate = catchAsync(
    async (
        req: Request<{ id: string }, {}, createOrUpdateResumeExperienceDto>,
        res: Response,
        next: NextFunction,
    ) => {
        const experience =
            await resumeTemplateService.createExperienceOfResumeTemplate(
                req.user.id,
                Number(req.params.id),
                req.body,
            );
        res.status(201).json({
            status: 'success',
            data: experience,
        });
    },
);
export const getExperienceOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const experience =
            await resumeTemplateService.getExperienceOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.experienceId),
            );
        res.status(200).json({
            status: 'success',
            data: experience,
        });
    },
);
export const getAllExperiencesOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const experiences =
            await resumeTemplateService.getAllExperiencesOfResumeTemplate(
                Number(req.params.id),
            );
        res.status(200).json({
            status: 'success',
            data: experiences,
        });
    },
);
export const updateExperienceOfResumeTemplate = catchAsync(
    async (
        req: Request<
            { id: string; experienceId: string },
            {},
            createOrUpdateResumeExperienceDto
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const experience =
            await resumeTemplateService.updateExperienceOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.experienceId),
                req.body,
            );
        res.status(200).json({
            status: 'success',
            data: experience,
        });
    },
);
export const deleteExperienceOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await resumeTemplateService.deleteExperienceOfResumeTemplate(
            Number(req.params.id),
            Number(req.params.experienceId),
        );
        res.status(200).json({
            status: 'success',
            data: null,
        });
    },
);
export const createLanguageOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getLanguageOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getAllLanguagesOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const updateLanguageOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const deleteLanguageOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const createInterestOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getInterestOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getAllInterestsOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const updateInterestOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const deleteInterestOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const createCourseOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getCourseOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getAllCoursesOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const updateCourseOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const deleteCourseOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const createOrganizationOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getOrganizationOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getAllOrganizationsOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const updateOrganizationOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const deleteOrganizationOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const createReferenceOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getReferenceOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getAllReferencesOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const updateReferenceOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const deleteReferenceOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const createCustomSectionOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getCustomSectionOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const getAllCustomSectionsOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const updateCustomSectionOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
export const deleteCustomSectionOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {};
