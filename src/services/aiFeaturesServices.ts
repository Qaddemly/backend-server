import { JobRepository } from '../Repository/Job/jobRepository';
import { redisClient } from '../config/redis';
import { Job } from '../entity/Job/Job';
import { JobStatus } from '../enums/jobStatus';
import AppError from '../utils/appError';
import * as accountServices from './accountServices';
import { getAllUserProfileInfo } from './profileServices';
import axios from 'axios';

// ------------------------- Job Recommendations -------------------------
export const recommendJobsForUser = async (userId: number) => {
    const isCached = await redisClient.get(`recommendedJobs:${userId}`);

    if (isCached) {
        return JSON.parse(isCached);
    }
    const userInfo = await getAllUserProfileInfo(userId);
    const jobs = await JobRepository.find({
        where: { status: JobStatus.OPENED },
    });

    const recommendedJobs: Job[] = [];

    try {
        const response = await axios.post('http://0.0.0.0:8001/recommend', {
            user: userInfo,
            jobs,
            select: 100,
        });
        console.log('response', response.data);

        // @ts-ignore
        console.log(
            'response.data.recommendations',
            // @ts-ignore
            response.data.recommendations.length,
        );

        // @ts-ignore
        for (let i = 0; i < response.data.recommendations.length; i++) {
            // @ts-ignore
            const job = await JobRepository.createQueryBuilder('job')
                // @ts-ignore
                .where('job.id = :id', {
                    // @ts-ignore
                    id: response.data.recommendations[i].id,
                })
                .leftJoinAndSelect('job.business', 'business')
                .getOne();

            recommendedJobs.push(job);
        }
        // Set expiration time for 3 hours
        await redisClient.set(
            `recommendedJobs:${userId}`,
            JSON.stringify(recommendedJobs),
            { EX: 3 * 60 * 60 },
        );
        return recommendedJobs;
    } catch (e) {
        throw new AppError('Error in getting recommended jobs', 400);
    }
};

// ------------------------- Job Posting Enhancements -------------------------
export const enhanceDescriptionOfJob = async (
    title: string,
    description: string,
    skills?: [string],
    keywords?: [string],
) => {
    const response = await axios.post(
        'http://127.0.0.1:8002/enhance-description',
        {
            title,
            description,
            skills: skills || [],
            keywords: keywords || [],
        },
    );
    if (!response.data) {
        throw new AppError('Error enhancing job description', 500);
    }
    return response.data;
};

export const enhanceOrGenerateJobSkills = async (
    title: string,
    description: string,
    skills?: [string],
    keywords?: [string],
) => {
    const response = await axios.post(
        'http://127.0.0.1:8002/enhance-or-generate-skills',
        {
            title,
            description,
            skills: skills || [],
            keywords: keywords || [],
        },
    );
    if (!response.data) {
        throw new AppError('Error enhancing or generating job skills', 500);
    }
    return response.data;
};

export const enhanceOrGenerateJobKeywords = async (
    title: string,
    description: string,
    skills?: [string],
    keywords?: [string],
) => {
    const response = await axios.post(
        'http://127.0.0.1:8002/enhance-or-generate-keywords',
        {
            title,
            description,
            skills: skills || [],
            keywords: keywords || [],
        },
    );
    if (!response.data) {
        throw new AppError('Error enhancing or generating job keywords', 500);
    }
    return response.data;
};

export const generateJobPost = async (prompt: string) => {
    const response = await axios.post(
        'http://127.0.0.1:8002/generate-job-from-prompt',
        {
            prompt,
        },
    );
    if (!response.data) {
        throw new AppError('Error generating job post', 500);
    }
    return response.data;
};

// ------------------------- Matching Score -------------------------

export const getMatchingScore = async (userId: number, jobId: number) => {
    // TODO: make cache Layer
    const isCached = await redisClient.get(`matchingScore:${userId}:${jobId}`);
    if (isCached) {
        return JSON.parse(isCached);
    }

    const userInfo = await getAllUserProfileInfo(userId);
    const job = await JobRepository.findOne({
        where: { id: jobId },
    });

    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const response = await axios.post('http://127.0.0.1:8003/match-score', {
        user: userInfo,
        job: job,
    });

    await redisClient.set(
        `matchingScore:${userId}:${jobId}`,
        JSON.stringify(response.data),
        { EX: 3 * 60 * 60 },
    );

    if (!response.data) {
        throw new AppError('Error calculating matching score', 500);
    }
    return response.data;
};

// ------------------------- Resume Builder -------------------------

export const generateOrEnhanceAboutMe = async (
    userId: number,
    aboutMe?: string,
) => {
    const user = await accountServices.getAllUserInformationForAI(userId);

    const response = await axios.post(
        'http://127.0.0.1:8004/generate-about-me',
        {
            user,
            aboutMe: aboutMe || '',
        },
    );
    if (!response.data) {
        throw new AppError('Error generating or enhancing about me', 500);
    }
    return response.data;
};
export const generateOrEnhanceAboutMeBasedOnJob = async (
    userId: number,
    jobDescription: string,
    aboutMe?: string,
) => {
    const user = await accountServices.getAllUserInformationForAI(userId);
    // return {
    //     user,
    //     aboutMe: aboutMe || '',
    //     jobDescription: jobDescription || '',
    // };
    const response = await axios.post(
        'http://127.0.0.1:8004/generate-about-me',
        {
            user,
            jobDescription: jobDescription || '',
            aboutMe: aboutMe || '',
        },
    );
    if (!response.data) {
        throw new AppError(
            'Error generating or enhancing about me based on job',
            500,
        );
    }
    return response.data;
};

export const generateOrEnhanceSkills = async (
    userId: number,
    skills?: [string],
) => {
    const user = await accountServices.getAllUserInformationForAI(userId);

    const response = await axios.post('http://127.0.0.1:8004/generate-skills', {
        user,
        skills: skills || [],
    });
    if (!response.data) {
        throw new AppError('Error generating or enhancing skills', 500);
    }

    return response.data['skills'].split(',').map((skill) => skill.trim());
};

export const generateOrEnhanceSkillsBasedOnJob = async (
    userId: number,
    jobDescription: string,
    skills?: [string],
) => {
    const user = await accountServices.getAllUserInformationForAI(userId);

    const response = await axios.post('http://127.0.0.1:8004/generate-skills', {
        user,
        jobDescription: jobDescription || '',
        skills: skills || [],
    });

    if (!response.data) {
        throw new AppError(
            'Error generating or enhancing skills based on job',
            500,
        );
    }
    return response.data['skills'].split(',').map((skill) => skill.trim());
};

// ------------------------- Cover Letter Builder -------------------------
export const coverLetterBuilderInputData = async (
    userId: number,
    jobDescription: string,
    existingBody?: string,
) => {
    const user = await accountServices.getAllUserInformationForAI(userId);

    return {
        user,
        jobDescription: jobDescription,
        existingBody: existingBody || '',
    };
};
