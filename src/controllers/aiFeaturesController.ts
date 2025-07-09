import { Request, Response } from 'express';
import catchAsync from 'express-async-handler';

import * as aiFeaturesServices from '../services/aiFeaturesServices';

export const recommendJobsForUser = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.id;
        const recommendedJobs =
            await aiFeaturesServices.recommendJobsForUser(userId);
        res.status(200).json({
            recommendedJobs,
        });
    },
);
// ------------------------- Job Posting Enhancements -------------------------
export const enhanceJobDescription = catchAsync(
    async (req: Request, res: Response) => {
        const { title, description, skills, keywords } = req.body;

        const enhancedDescription =
            await aiFeaturesServices.enhanceDescriptionOfJob(
                title,
                description,
                skills,
                keywords,
            );
        res.status(200).json({
            enhancedDescription,
        });
    },
);

export const enhanceOrGenerateJobSkills = catchAsync(
    async (req: Request, res: Response) => {
        const { title, description, skills, keywords } = req.body;

        const enhancedSkills =
            await aiFeaturesServices.enhanceOrGenerateJobSkills(
                title,
                description,
                skills,
                keywords,
            );
        res.status(200).json({
            enhancedSkills,
        });
    },
);

export const enhanceOrGenerateJobKeywords = catchAsync(
    async (req: Request, res: Response) => {
        const { title, description, skills, keywords } = req.body;

        const enhancedKeywords =
            await aiFeaturesServices.enhanceOrGenerateJobKeywords(
                title,
                description,
                skills,
                keywords,
            );
        res.status(200).json({
            enhancedKeywords,
        });
    },
);

export const generateJobPost = catchAsync(
    async (req: Request, res: Response) => {
        const { prompt } = req.body;

        const generatedJobPost =
            await aiFeaturesServices.generateJobPost(prompt);
        res.status(200).json({
            generatedJobPost,
        });
    },
);

// ------------------------- Matching Score -------------------------
export const matchingScore = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const jobId = Number(req.params.jobId);
    // Assuming you have a service to fetch matching score
    const score = await aiFeaturesServices.getMatchingScore(userId, jobId);
    res.status(200).json({
        score,
    });
});

// ------------------------- Resume Template Enhancements -------------------------

export const generateOrEnhanceAboutMe = catchAsync(
    async (req: Request, res: Response) => {
        const { aboutMe } = req.body;
        const userId = req.user?.id;

        // Assuming you have a service to enhance or generate about me section
        const enhancedAboutMe =
            await aiFeaturesServices.generateOrEnhanceAboutMe(userId, aboutMe);
        // @ts-ignore
        res.status(200).json({
            // @ts-ignore
            enhancedAboutMe: enhancedAboutMe.about_me,
        });
    },
);

export const generateOrEnhanceAboutMeBasedOnJob = catchAsync(
    async (req: Request, res: Response) => {
        const { jobDescription, aboutMe } = req.body;
        const userId = req.user?.id;

        // Assuming you have a service to enhance or generate about me section based on job
        const enhancedAboutMe =
            await aiFeaturesServices.generateOrEnhanceAboutMeBasedOnJob(
                userId,
                jobDescription,
                aboutMe,
            );

        res.status(200).json({
            // @ts-ignore
            enhancedAboutMe: enhancedAboutMe.about_me,
        });
    },
);

export const generateOrEnhanceSkills = catchAsync(
    async (req: Request, res: Response) => {
        const { skills } = req.body;
        const userId = req.user?.id;

        // Assuming you have a service to enhance or generate skills
        const enhancedSkills = await aiFeaturesServices.generateOrEnhanceSkills(
            userId,
            skills,
        );
        res.status(200).json({
            enhancedSkills,
        });
    },
);

export const generateOrEnhanceSkillsBasedOnJob = catchAsync(
    async (req: Request, res: Response) => {
        const { jobDescription, skills } = req.body;
        const userId = req.user?.id;
        // Assuming you have a service to enhance or generate skills based on job
        const enhancedSkills =
            await aiFeaturesServices.generateOrEnhanceSkillsBasedOnJob(
                userId,
                jobDescription,
                skills,
            );
        res.status(200).json({
            enhancedSkills,
        });
    },
);

// ------------------------- KeyWord Optimization -------------------------

export const keywordOptimization = catchAsync(
    async (req: Request, res: Response) => {
        const { resumeId, jobDescription } = req.body;
        const userId = req.user?.id;

        // Assuming you have a service to optimize keywords
        const optimizedKeywords = await aiFeaturesServices.keywordOptimization(
            resumeId,
            userId,
            jobDescription,
        );
        res.status(200).json({
            optimizedKeywords,
        });
    },
);

export const keywordOptimizationPdf = catchAsync(
    async (req: Request, res: Response) => {
        const optimizedKeywords =
            await aiFeaturesServices.keywordOptimizationPdf(req);

        res.status(200).json({
            optimizedKeywords,
        });
    },
);

// ------------------------- Cover Letter Builder -------------------------
export const coverLetterBuilderOrEnhance = catchAsync(
    async (req: Request, res: Response) => {
        const { jobDescription, existingBody } = req.body;
        const userId = req.user?.id;
        // Assuming you have a service to fetch user data
        const allData = await aiFeaturesServices.coverLetterBuilderInputData(
            userId,
            jobDescription,
            existingBody,
        );
        res.status(200).json({
            ...allData,
        });
    },
);
// ------------------------- Chat Bot -------------------------
export const chatBot = catchAsync(async (req: Request, res: Response) => {
    const { message } = req.body;
    const userId = req.user?.id;

    // Assuming you have a service to handle chat Bot interactions
    const response = await aiFeaturesServices.chatBot(userId, message);
    res.status(200).json({
        // @ts-ignore
        ...response,
    });
});
