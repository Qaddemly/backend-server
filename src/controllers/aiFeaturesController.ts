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
    const { jobId } = req.body;
    const userId = req.user?.id;

    // Assuming you have a service to fetch matching score
    const score = await aiFeaturesServices.getMatchingScore(userId, jobId);
    res.status(200).json({
        score,
    });
});

// ------------------------- Cover Letter Builder -------------------------
export const coverLetterBuilderInputData = catchAsync(
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
