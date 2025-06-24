import { JobRepository } from '../Repository/Job/jobRepository';
import { redisClient } from '../config/redis';
import { Job } from '../entity/Job/Job';
import { JobStatus } from '../enums/jobStatus';
import AppError from '../utils/appError';
import * as accountServices from './accountServices';
import { getUserInfoToRecommendJobs } from './profileServices';

export const recommendJobsForUser = async (userId: number) => {
    const isCached = await redisClient.get(`recommendedJobs:${userId}`);

    if (isCached) {
        return JSON.parse(isCached);
    }
    const userInfo = await getUserInfoToRecommendJobs(userId);
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

export const enhanceDescriptionOfJob = (
    title: string,
    description: string,
    skills?: [string],
    keywords?: [string],
) => {};

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
