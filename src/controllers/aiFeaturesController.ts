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

export const enhanceJobPost = catchAsync(
    async (req: Request, res: Response) => {
        res.status(200).json({});
    },
);
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
