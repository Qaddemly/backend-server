import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import {
    createUserOneExperienceService,
    createUserOneOrMoreLanguageService,
    createUserOneOrMoreSkillService,
    deleteMeService,
    deleteUserOneExperienceService,
    deleteUserOneOrMoreLanguageService,
    deleteUserOneOrMoreSkillService,
    updateUserOneExperienceService,
    updateUserOneEducationService,
    createUserOneEducationService,
    deleteUserOneEducationService,
    updateAccountBasicInfoService,
    deleteUserOneResumeService,
    addUserOneResumeService,
    getAllUserResumesService,
    createProjectService,
    getProjectByIdService,
    getProjectsOfUserIdService,
    getProjectsOfLoggedInUserService,
    updateProjectService,
    deleteProjectService,
    createVolunteeringService,
    getVolunteeringByIdService,
    getVolunteeringsOfUserByIdService,
    getVolunteeringsOfLoggenInUserService,
    updateVolunteeringService,
    deleteVolunteeringService,
} from '../services/profileServices';
import catchAsync from 'express-async-handler';
import {
    createProjectDTO,
    createVolunteeringDTO,
    updateProjectDTO,
    updateVolunteeringDTO,
} from '../dtos/userDto';
import { interfaces } from 'inversify';

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
            const language = await createUserOneOrMoreLanguageService(req);
            res.status(201).json({
                success: true,
                language,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteUserOneOrMoreLanguage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteUserOneOrMoreLanguageService(req);
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

/**
 * User Projects
 * */
export const createProject = catchAsync(
    async (
        req: Request<{}, {}, createProjectDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const project = await createProjectService(req.user.id, req.body);
        res.status(201).json({
            success: true,
            project,
        });
    },
);

export const getProjectById = catchAsync(
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const project = await getProjectByIdService(Number(req.params.id));
        res.status(200).json({
            success: true,
            project,
        });
    },
);

export const getProjectsOfUserById = catchAsync(
    async (
        req: Request<{ userId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const projects = await getProjectsOfUserIdService(
            Number(req.params.userId),
        );
        res.status(200).json({
            success: true,
            projects,
        });
    },
);

export const getProjectsOfLoggedInUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const projects = await getProjectsOfLoggedInUserService(req.user.id);
        res.status(200).json({
            success: true,
            projects,
        });
    },
);
export const updateProject = catchAsync(
    async (
        req: Request<{ id: string }, {}, updateProjectDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const project = await updateProjectService(
            req.user.id,
            Number(req.params.id),
            req.body,
        );
        res.status(200).json({
            success: true,
            project,
        });
    },
);
export const deleteProject = catchAsync(
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        await deleteProjectService(req.user.id, Number(req.params.id));
        res.status(204).json({});
    },
);

export const createVolunteering = catchAsync(
    async (
        req: Request<{}, {}, createVolunteeringDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const volunteering = await createVolunteeringService(
            req.user.id,
            req.body,
        );
        res.status(201).json({
            success: true,
            volunteering,
        });
    },
);
export const getVolunteeringById = catchAsync(
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const volunteering = await getVolunteeringByIdService(
            Number(req.params.id),
        );
        res.status(200).json({
            success: true,
            volunteering,
        });
    },
);
export const getVolunteeringsOfUserById = catchAsync(
    async (
        req: Request<{ userId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const volunteerings = await getVolunteeringsOfUserByIdService(
            Number(req.params.userId),
        );
        res.status(200).json({
            success: true,
            volunteerings,
        });
    },
);
export const getVolunteeringsOfLoggedInUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const volunteerings = await getVolunteeringsOfLoggenInUserService(
            req.user.id,
        );
        res.status(200).json({
            success: true,
            volunteerings,
        });
    },
);
export const updateVolunteering = catchAsync(
    async (
        req: Request<{ id: string }, {}, updateVolunteeringDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const volunteering = await updateVolunteeringService(
            req.user.id,
            Number(req.params.id),
            req.body,
        );
        res.status(200).json({
            success: true,
            volunteering,
        });
    },
);
export const deleteVolunteering = catchAsync(
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        await deleteVolunteeringService(req.user.id, Number(req.params.id));
        res.status(204).json({});
    },
);
