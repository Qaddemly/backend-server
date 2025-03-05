import { NextFunction, Request, Response } from 'express';
import { ResumeTemplateRepository } from '../Repository/ResumeTemplate/resumeTemplateRepository';
import { resumeTemplateRouter } from '../routes/resumeTemplateRoutes';
import catchAsync from 'express-async-handler';
import * as resumeTemplateService from '../services/resumeTemplateService';
import {
    createOrUpdateCourseDTO,
    createOrUpdateCustomSectionDTO,
    createOrUpdateInterestDTO,
    createOrUpdateLanguageDTO,
    createOrUpdateOrganizationDTO,
    createOrUpdateReferenceDTO,
    createOrUpdateResumeExperienceDTO,
} from '../dtos/resumeTemplateDto';

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
        req: Request<{ id: string }, {}, createOrUpdateResumeExperienceDTO>,
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
            createOrUpdateResumeExperienceDTO
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
export const createLanguageOfResumeTemplate = catchAsync(
    async (
        req: Request<{ id: string }, {}, createOrUpdateLanguageDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const language =
            await resumeTemplateService.createLanguageOfResumeTemplate(
                Number(req.params.id),
                req.body,
            );
        res.status(201).json({
            status: 'success',
            data: language,
        });
    },
);
export const getLanguageOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const language =
            await resumeTemplateService.getLanguageOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.languageId),
            );
        res.status(200).json({
            status: 'success',
            data: language,
        });
    },
);
export const getAllLanguagesOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const languages =
            await resumeTemplateService.getAllLanguagesOfResumeTemplate(
                Number(req.params.id),
            );
        res.status(200).json({
            status: 'success',
            data: languages,
        });
    },
);
export const updateLanguageOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const language =
            await resumeTemplateService.updateLanguageOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.languageId),
                req.body,
            );
        res.status(200).json({
            status: 'success',
            data: language,
        });
    },
);
export const deleteLanguageOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await resumeTemplateService.deleteLanguageOfResumeTemplate(
            Number(req.params.id),
            Number(req.params.languageId),
        );
        res.status(200).json({
            status: 'success',
            data: null,
        });
    },
);
export const createInterestOfResumeTemplate = catchAsync(
    async (
        req: Request<{ id: string }, {}, createOrUpdateInterestDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const interest =
            await resumeTemplateService.createInterestOfResumeTemplate(
                Number(req.params.id),
                req.body,
            );
        res.status(201).json({
            status: 'success',
            data: interest,
        });
    },
);
export const getInterestOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const interest =
            await resumeTemplateService.getInterestOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.interestId),
            );
        res.status(200).json({
            status: 'success',
            data: interest,
        });
    },
);
export const getAllInterestsOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const interests =
            await resumeTemplateService.getAllInterestsOfResumeTemplate(
                Number(req.params.id),
            );
        res.status(200).json({
            status: 'success',
            data: interests,
        });
    },
);
export const updateInterestOfResumeTemplate = catchAsync(
    async (
        req: Request<
            { id: string; interestId: string },
            {},
            createOrUpdateInterestDTO
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const interest =
            await resumeTemplateService.updateInterestOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.interestId),
                req.body,
            );
        res.status(200).json({
            status: 'success',
            data: interest,
        });
    },
);
export const deleteInterestOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await resumeTemplateService.deleteInterestOfResumeTemplate(
            Number(req.params.id),
            Number(req.params.interestId),
        );
        res.status(200).json({
            status: 'success',
            data: null,
        });
    },
);
export const createCourseOfResumeTemplate = catchAsync(
    async (
        req: Request<{ id: string }, {}, createOrUpdateCourseDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const course = await resumeTemplateService.createCourseOfResumeTemplate(
            Number(req.params.id),
            req.body,
        );
        res.status(201).json({
            status: 'success',
            data: course,
        });
    },
);
export const getCourseOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const course = await resumeTemplateService.getCourseOfResumeTemplate(
            Number(req.params.id),
            Number(req.params.courseId),
        );
        res.status(200).json({
            status: 'success',
            data: course,
        });
    },
);
export const getAllCoursesOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const courses =
            await resumeTemplateService.getAllCoursesOfResumeTemplate(
                Number(req.params.id),
            );
        res.status(200).json({
            status: 'success',
            data: courses,
        });
    },
);
export const updateCourseOfResumeTemplate = catchAsync(
    async (
        req: Request<
            { id: string; courseId: string },
            {},
            createOrUpdateCourseDTO
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const course = await resumeTemplateService.updateCourseOfResumeTemplate(
            Number(req.params.id),
            Number(req.params.courseId),
            req.body,
        );
        res.status(200).json({
            status: 'success',
            data: course,
        });
    },
);
export const deleteCourseOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await resumeTemplateService.deleteCourseOfResumeTemplate(
            Number(req.params.id),
            Number(req.params.courseId),
        );
        res.status(200).json({
            status: 'success',
            data: null,
        });
    },
);
export const createOrganizationOfResumeTemplate = catchAsync(
    async (
        req: Request<{ id: string }, {}, createOrUpdateOrganizationDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const organization =
            await resumeTemplateService.createOrganizationOfResumeTemplate(
                Number(req.params.id),
                req.body,
            );
        res.status(201).json({
            status: 'success',
            data: organization,
        });
    },
);
export const getOrganizationOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const organization =
            await resumeTemplateService.getOrganizationOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.organizationId),
            );
        res.status(200).json({
            status: 'success',
            data: organization,
        });
    },
);
export const getAllOrganizationsOfResumeTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const organizations =
        await resumeTemplateService.getAllOrganizationsOfResumeTemplate(
            Number(req.params.id),
        );
    res.status(200).json({
        status: 'success',
        data: organizations,
    });
};

export const updateOrganizationOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const organization =
            await resumeTemplateService.updateOrganizationOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.organizationId),
                req.body,
            );
        res.status(200).json({
            status: 'success',
            data: organization,
        });
    },
);
export const deleteOrganizationOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await resumeTemplateService.deleteOrganizationOfResumeTemplate(
            Number(req.params.id),
            Number(req.params.organizationId),
        );
        res.status(200).json({
            status: 'success',
            data: null,
        });
    },
);
export const createReferenceOfResumeTemplate = catchAsync(
    async (
        req: Request<{ id: string }, {}, createOrUpdateReferenceDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const reference =
            await resumeTemplateService.createReferenceOfResumeTemplate(
                Number(req.params.id),
                req.body,
            );
        res.status(201).json({
            status: 'success',
            data: reference,
        });
    },
);
export const getReferenceOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const reference =
            await resumeTemplateService.getReferenceOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.referenceId),
            );
        res.status(200).json({
            status: 'success',
            data: reference,
        });
    },
);
export const getAllReferencesOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const references =
            await resumeTemplateService.getAllReferencesOfResumeTemplate(
                Number(req.params.id),
            );
        res.status(200).json({
            status: 'success',
            data: references,
        });
    },
);
export const updateReferenceOfResumeTemplate = catchAsync(
    async (
        req: Request<
            { id: string; referenceId: string },
            {},
            createOrUpdateReferenceDTO
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const reference =
            await resumeTemplateService.updateReferenceOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.referenceId),
                req.body,
            );
        res.status(200).json({
            status: 'success',
            data: reference,
        });
    },
);
export const deleteReferenceOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await resumeTemplateService.deleteReferenceOfResumeTemplate(
            Number(req.params.id),
            Number(req.params.referenceId),
        );
        res.status(200).json({
            status: 'success',
            data: null,
        });
    },
);
export const createCustomSectionOfResumeTemplate = catchAsync(
    async (
        req: Request<{ id: string }, {}, createOrUpdateCustomSectionDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const customSection =
            await resumeTemplateService.createCustomSectionOfResumeTemplate(
                Number(req.params.id),
                req.body,
            );
        res.status(201).json({
            status: 'success',
            data: customSection,
        });
    },
);
export const getCustomSectionOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const customSection =
            await resumeTemplateService.getCustomSectionOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.customSectionId),
            );
        res.status(200).json({
            status: 'success',
            data: customSection,
        });
    },
);
export const getAllCustomSectionsOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const customSections =
            await resumeTemplateService.getAllCustomSectionsOfResumeTemplate(
                Number(req.params.id),
            );
        res.status(200).json({
            status: 'success',
            data: customSections,
        });
    },
);
export const updateCustomSectionOfResumeTemplate = catchAsync(
    async (
        req: Request<
            { id: string; customSectionId: string },
            {},
            createOrUpdateCustomSectionDTO
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const customSection =
            await resumeTemplateService.updateCustomSectionOfResumeTemplate(
                Number(req.params.id),
                Number(req.params.customSectionId),
                req.body,
            );
        res.status(200).json({
            status: 'success',
            data: customSection,
        });
    },
);
export const deleteCustomSectionOfResumeTemplate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        await resumeTemplateService.deleteCustomSectionOfResumeTemplate(
            Number(req.params.id),
            Number(req.params.customSectionId),
        );
        res.status(200).json({
            status: 'success',
            data: null,
        });
    },
);
