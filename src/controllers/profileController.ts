import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import {
    createUserOneExperienceService,
    createUserOneLanguageService,
    createUserOneOrMoreSkillService,
    deleteMeService,
    deleteUserOneExperienceService,
    deleteUserOneLanguageService,
    deleteUserOneOrMoreSkillService,
    updateUserOneExperienceService,
    updateUserOneEducationService,
    createUserOneEducationService,
    deleteUserOneEducationService,
    updateAccountBasicInfoService,
    deleteUserOneResumeService,
    addUserOneResumeService,
    getAllUserResumesService,
} from '../services/profileServices';
import catchAsync from 'express-async-handler';

export const deleteMe = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteMeService(req);
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const updateUserOneExperience = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const experience = await updateUserOneExperienceService(req);
            res.status(200).json({
                success: true,
                experience,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const createUserOneExperience = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const experience = await createUserOneExperienceService(req);
            res.status(201).json({
                success: true,
                experience,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteUserOneExperience = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteUserOneExperienceService(req);
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const createUserOneOrMoreSkills = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const skills = await createUserOneOrMoreSkillService(req);
            res.status(201).json({
                success: true,
                skills,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteUserOneOrMoreSkill = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteUserOneOrMoreSkillService(req);
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const createUserOneLanguage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const language = await createUserOneLanguageService(req);
            res.status(201).json({
                success: true,
                language,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteUserOneLanguage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteUserOneLanguageService(req);
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const updateUserOneEducation = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const education = await updateUserOneEducationService(req);
            res.status(200).json({
                success: true,
                education,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const createUserOneEducation = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const education = await createUserOneEducationService(req);
            res.status(200).json({
                success: true,
                education,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteUserOneEducation = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const education = await deleteUserOneEducationService(req);
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const addUserOneResume = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const resume = await addUserOneResumeService(req);
            res.status(200).json({
                success: true,
                resume,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllUserResumes = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const resumes = await getAllUserResumesService(req);
            res.status(200).json({
                success: true,
                resumes,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteUserOneResume = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const resume = await deleteUserOneResumeService(req);
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const updateUserBasicInfo = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedUser = await updateAccountBasicInfoService(req);
            res.status(200).json({ success: true, updatedUser });
        } catch (err) {
            return next(err);
        }
    },
);
