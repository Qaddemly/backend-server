import { JobRepository } from '../Repository/Job/jobRepository';
import { redisClient } from '../config/redis';
import { Job } from '../entity/Job/Job';
import { JobStatus } from '../enums/jobStatus';
import AppError from '../utils/appError';
import * as accountServices from './accountServices';
import { getAllUserProfileInfo } from './profileServices';
import axios from 'axios';
import { getAllResumeInfo } from './resumeTemplateService';
import { Request } from 'express';
import FormData from 'form-data';
import { JobApplicationRepository } from '../Repository/Job/jobApplicationRepository';

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
        'http://0.0.0.0:8002/enhance-description',
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
        'http://0.0.0.0:8002/enhance-or-generate-skills',
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
        'http://0.0.0.0:8002/enhance-or-generate-keywords',
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
        'http://0.0.0.0:8002/generate-job-from-prompt',
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

    const response = await axios.post('http://0.0.0.0:8004/generate-about-me', {
        user,
        aboutMe: aboutMe || '',
    });
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
    const response = await axios.post('http://0.0.0.0:8004/generate-about-me', {
        user,
        jobDescription: jobDescription || '',
        aboutMe: aboutMe || '',
    });
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

    const response = await axios.post('http://0.0.0.0:8004/generate-skills', {
        user,
        skills: skills || [],
    });
    if (!response.data) {
        throw new AppError('Error generating or enhancing skills', 500);
    }
    // @ts-ignore
    return response.data.skills;
};

export const generateOrEnhanceSkillsBasedOnJob = async (
    userId: number,
    jobDescription: string,
    skills?: [string],
) => {
    const user = await accountServices.getAllUserInformationForAI(userId);

    const response = await axios.post('http://0.0.0.0:8004/generate-skills', {
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
    // @ts-ignore
    return response.data.skills;
};

// ------------------------- KeyWord Optimization -------------------------

export const keywordOptimization = async (
    resumeId: number,
    accountId: number,
    jobDescription: string,
) => {
    const resumeData = await getAllResumeInfo(resumeId, accountId);
    const userData =
        await accountServices.getAllUserInformationForAI(accountId);

    const response = await axios.post('http://127.0.0.1:8006/optimize-resume', {
        userData,
        resumeData,
        jobDescription,
    });

    return response.data;
};

export const keywordOptimizationPdf = async (req: Request) => {
    const userData = await accountServices.getAllUserInformationForAI(
        req.user.id,
    );

    const form = new FormData();

    form.append('resume_pdf', req.file.buffer, req.file.originalname);

    form.append('job_description', req.body.job_description);
    form.append('user_data', JSON.stringify(userData));
    const response = await axios.post(
        'http://127.0.0.1:8006/optimize-resume-pdf',
        form,
        {
            headers: {
                ...form.getHeaders(),
                Accept: 'application/json',
            },
            // @ts-ignore
            maxBodyLength: Infinity,
        },
    );
    return response.data;
};

// ------------------------- Cover Letter Builder -------------------------
export const coverLetterBuilderInputData = async (
    userId: number,
    jobDescription: string,
    existingBody?: string,
) => {
    const user = await accountServices.getAllUserInformationForAI(userId);

    const response = await axios.post(
        'http://0.0.0.0:8005/generate-enhance-cover-letter',
        {
            user,
            jobDescription: jobDescription || '',
            existingBody: existingBody || '',
        },
    );
    if (!response.data) {
        throw new AppError('Error generating cover letter input data', 500);
    }
    return {
        // @ts-ignore
        coverLetterBody: response.data.result,
    };
};

//------------------------- ATS scanning -------------------------

export const atsScanning = async (jobId: number) => {
    const job = await JobRepository.findOne({
        where: { id: jobId },
    });

    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const jobApplications = await JobApplicationRepository.find({
        where: { job: { id: jobId } },
        relations: [
            'job_application_education',
            'job_application_experience',
            'job_application_resume',
            'job_application_state',
        ],
    });
    if (!jobApplications) {
        throw new AppError('No job applications found for this job', 404);
    }
    const atsScanUrl = `http://127.0.0.1:8010/process`;
    const atsScanBody = { success: true, job, jobApplication: jobApplications };
    try {
        const response = await axios.post(atsScanUrl, atsScanBody);
        //@ts-ignore
        return response.data.results;
    } catch (error) {
        console.error('Error during ATS scanning:', error);
        throw new AppError('Error during ATS scanning', 500);
    }

export const chatBot = async (userId: number, message: string) => {
    const allUserData =
        await accountServices.getAllUserInformationForAI(userId);

    const user_type = 'candidate';

    const response = await axios.post(
        'https://151198407666.ngrok-free.app/qaddemly-bot',
        {
            question: message,
            user_type,
            user_data: allUserData,
        },
    );
    if (!response.data) {
        throw new AppError('Error in chat bot response', 500);
    }
    return response.data;
};
