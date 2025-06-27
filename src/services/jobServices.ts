import { Request } from 'express';
import { CreateJobBodyBTO, UpdateJobBodyBTO } from '../dtos/jobDto';
import { BusinessRepository } from '../Repository/Business/businessRepository';
import AppError from '../utils/appError';
import { Job } from '../entity/Job/Job';
import { JobRepository } from '../Repository/Job/jobRepository';
import { HrEmployeeRepository } from '../Repository/Business/hrEmployeeRepository';
import { HrRole } from '../enums/HrRole';

import { Paginate } from '../utils/pagination/decorator';
import { FilterOperator } from '../utils/pagination/filter';
import csvParser from 'csv-parser';

import axios from 'axios';

import {
    paginate,
    PaginateConfig,
    PaginationType,
} from '../utils/pagination/typeorm-paginate';
import { JobStatus } from '../enums/jobStatus';
import { Not } from 'typeorm';

import { Account } from '../entity/Account/Account';
import { JobApplicationStateEnum } from '../enums/jobApplicationStateEnum';

import { getAllUserProfileInfo } from './profileServices';
import { AccountSavedJobsRepository } from '../Repository/Job/accountSavedJobRepository';
import { AccountSavedJobs } from '../entity/Job/AccountSavedJobs';
import { EmploymentType } from '../enums/employmentType';
import fs from 'fs';
import { Country } from '../enums/country';
import path from 'path';
import { redisClient } from '../config/redis';
import { sendJobNotification } from './notificationServices';
import { eventEmitter } from '../events/eventEmitter';
import { publishToQueue } from '../config/rabbitMQ';
import { ApplicationQuestionsModel } from '../models/jobApplicationQuestions';
import { Logger } from '../utils/logger';

export const createJobService = async (
    req: Request<{}, {}, CreateJobBodyBTO>,
) => {
    const {
        title,
        description,
        currency,
        location,
        location_type,
        skills,
        salary,
        employee_type,
        keywords,
        experience,
        business_id,
        extra_application_link,
        has_extra_link_application,
        questions,
    } = req.body;
    const userId = Number(req.user.id);
    const business = await BusinessRepository.findOneBy({ id: business_id });
    if (!business) {
        throw new AppError('Business with that id not found', 404);
    }
    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        userId,
        business.id,
        [
            HrRole.SUPER_ADMIN,
            HrRole.HR,
            HrRole.RECRUITER,
            HrRole.HIRING_MANAGER,
            HrRole.SUPER_ADMIN,
            HrRole.OWNER,
        ],
    );
    if (!isAllowedToPostJob) {
        throw new AppError('you do not have permission to that action', 403);
    }
    const newJob = new Job();
    newJob.title = title;
    newJob.description = description;
    newJob.country = location.country;
    newJob.city = location.city;
    newJob.location_type = location_type;
    newJob.skills = skills;
    newJob.salary = salary;
    newJob.employee_type = employee_type;
    newJob.keywords = keywords;
    newJob.experience = experience;
    newJob.business = business;
    newJob.has_extra_link_application = has_extra_link_application;
    newJob.extra_application_link = extra_application_link;
    newJob.currency = currency;

    //await sendJobNotification(newJob);
    const job = await JobRepository.save(newJob);
    const newQuestions = await ApplicationQuestionsModel.create({
        questions,
        jobId: job.id,
    });
    eventEmitter.emit('sendJobPostedNotification', newJob);
    //await publishToQueue('send_notification', { jobId: newJob.id });

    return { ...job, questions: newQuestions.questions };
};

export const getOneJobService = async (req: Request) => {
    const jobId = Number(req.params.id);
    let userId = req.user && req.user.id ? Number(req.user.id) : null;
    const job = await JobRepository.findJobDetails(jobId);
    if (!job.id) {
        throw new AppError('Job not found', 404);
    }
    if (!userId) {
        return { ...job, isSaved: false };
    } else {
        const isSaved = await JobRepository.query(`
    SELECT job.* FROM job 
    INNER JOIN account_saved_jobs ON account_saved_jobs.job_id = job.id
    INNER JOIN account ON account.id = account_saved_jobs.account_id
    WHERE account.id =${userId} and job.id=${jobId}`);

        return { ...job, isSaved: isSaved.length > 0 ? true : false };
    }
};

export const updateJobService = async (
    req: Request<{ id: string }, {}, UpdateJobBodyBTO>,
) => {
    const {
        title,
        description,
        location,
        location_type,
        skills,
        salary,
        employee_type,
        keywords,
        experience,
        has_extra_link_application,
        extra_application_link,
        questions,
        currency,
    } = req.body;
    const userId = Number(req.user.id);
    const jobId = Number(req.params.id);
    const foundedJob = await JobRepository.findOne({
        where: { id: jobId },
        relations: ['business'],
    });
    if (!foundedJob) {
        throw new AppError('Job not found', 404);
    }
    const isAllowedToUpdateJob = await HrEmployeeRepository.checkPermission(
        userId,

        foundedJob.business.id,
        [
            HrRole.OWNER,
            HrRole.SUPER_ADMIN,
            HrRole.HR,
            HrRole.RECRUITER,
            HrRole.HIRING_MANAGER,
        ],
    );
    if (!isAllowedToUpdateJob) {
        throw new AppError('you do not have permission to post job', 403);
    }

    const job = await JobRepository.findOne({
        where: { id: jobId },
    });

    if (!job) {
        throw new AppError('Job not found', 404);
    }
    if (title) job.title = title;
    if (description) job.description = description;
    if (location) {
        job.country = location.country;
        job.city = location.city;
    }
    if (location_type) job.location_type = location_type;
    if (skills) job.skills = skills;
    if (salary) job.salary = salary;
    if (employee_type) job.employee_type = employee_type;
    if (keywords) job.keywords = keywords;
    if (experience) job.experience = experience;
    if (has_extra_link_application)
        job.has_extra_link_application = has_extra_link_application;
    if (extra_application_link)
        job.extra_application_link = extra_application_link;

    if (currency) job.currency = currency;
    const questionss = await ApplicationQuestionsModel.findOneAndUpdate(
        { jobId: job.id },
        { questions: questions || [] },
        { new: true },
    );
    const updatedJob = await JobRepository.save(job);

    return { ...updatedJob, questions: questionss.questions };
};
// export const makeJobClosedService = async (req: Request) => {
//     const userId = Number(req.user.id);
//     const jobId = Number(req.params.id);
//     const job = await JobRepository.findOne({
//         where: { id: jobId },
//         relations: ['business'],
//     });
//     if (!job) {
//         throw new AppError('Job not found', 404);
//     }
//     const isAllowedToUpdateJob = await HrEmployeeRepository.checkPermission(
//         userId,

//         job.business.id,
//         [
//             HrRole.SUPER_ADMIN,
//             HrRole.HR,
//             HrRole.RECRUITER,
//             HrRole.HIRING_MANAGER,
//             HrRole.SUPER_ADMIN,
//         ],
//     );
//     if (!isAllowedToUpdateJob) {
//         throw new AppError('you do not have permission to do that action', 403);
//     }
//     if (job.status === JobStatus.CLOSED) {
//         throw new AppError('Job is already Closed', 409);
//     }
//     job.status = JobStatus.CLOSED;
//     await JobRepository.save(job);
//     return job;
// };

// export const makeJobArchivedService = async (req: Request) => {
//     const userId = Number(req.user.id);
//     const jobId = Number(req.params.id);
//     const job = await JobRepository.findOne({
//         where: { id: jobId },
//         relations: ['business'],
//     });
//     if (!job) {
//         throw new AppError('Job not found', 404);
//     }
//     const isAllowedToUpdateJob = await HrEmployeeRepository.checkPermission(
//         userId,

//         job.business.id,
//         [
//             HrRole.SUPER_ADMIN,
//             HrRole.HR,
//             HrRole.RECRUITER,
//             HrRole.HIRING_MANAGER,
//             HrRole.SUPER_ADMIN,
//         ],
//     );
//     if (!isAllowedToUpdateJob) {
//         throw new AppError('you do not have permission to do that action', 403);
//     }

//     if (job.status === JobStatus.ARCHIVED) {
//         throw new AppError('Job is already archived', 409);
//     }
//     job.status = JobStatus.ARCHIVED;
//     await JobRepository.save(job);
//     return job;
// };

export const saveJobToUserService = async (userId: number, jobId: number) => {
    const job = await JobRepository.findOneBy({ id: jobId });
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const savedJob = await AccountSavedJobsRepository.findOneBy({
        account: { id: userId },
        job: { id: jobId },
    });
    if (savedJob) {
        throw new AppError('Job already saved', 409);
    }
    const newSavedJob = await AccountSavedJobsRepository.createSavedJob(
        userId,
        jobId,
    );
};

export const removeSavedJobFromUserService = async (
    userId: number,
    jobId: number,
) => {
    const job = await JobRepository.findOneBy({ id: jobId });
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const savedJob = await AccountSavedJobsRepository.findOneBy({
        account: { id: userId },
        job: { id: jobId },
    });
    if (!savedJob) {
        throw new AppError('Job already not saved', 404);
    }
    await AccountSavedJobsRepository.deleteSavedJob(userId, jobId);
};

// export const getAllUserSavedJobsService = async (req: Request) => {
//     const userId = Number(req.user.id);

//     const account = await AccountRepository.getAccountWithSavedJobs(userId);

//     return account.saved_jobs;
// };
// export const getAllUserSavedJobsService = async (req: Request) => {
//     const userId = Number(req.user.id);

//     const account = await AccountRepository.getAccountWithSavedJobs(userId);

//     return account.saved_jobs;
// };

export const getAllUserSavedJobsService = async (req: Request) => {
    const userId = Number(req.user.id);

    try {
        //console.log('req', req.query);
        const transformedQuery = Paginate(req);
        //console.log('transformedQuery', transformedQuery);
        const paginateConfig: PaginateConfig<AccountSavedJobs> = {
            searchableColumns: ['job.title'],
            sortableColumns: ['created_at'],
            relations: ['job'],
            defaultSortBy: [['created_at', 'DESC']],
            maxLimit: 20,
            defaultLimit: transformedQuery.limit,
            where: { account: { id: userId } },

            paginationType: PaginationType.TAKE_AND_SKIP,
        };
        const queryBuilder = AccountSavedJobsRepository;

        const jobs = await paginate<AccountSavedJobs>(
            transformedQuery,
            queryBuilder,
            paginateConfig,
        );

        return jobs;
    } catch (err) {
        console.error('Error in getting jobs', err);
        throw new AppError('Error in getting jobs', 400);
    }
};

export const getAllJobsSearchWithFilterService = async (req: Request) => {
    try {
        //console.log('req', req.query);
        const transformedQuery = Paginate(req);
        //console.log('transformedQuery', transformedQuery);
        const paginateConfig: PaginateConfig<Job> = {
            searchableColumns: ['title', 'business.name', 'description'],
            sortableColumns: ['salary', 'created_at'],
            filterableColumns: {
                country: [FilterOperator.EQ],
                city: [FilterOperator.EQ],
                salary: [
                    FilterOperator.EQ,
                    FilterOperator.GTE,
                    FilterOperator.GT,
                    FilterOperator.LT,
                    FilterOperator.LTE,
                ],
                experience: [
                    FilterOperator.EQ,
                    FilterOperator.GTE,
                    FilterOperator.GT,
                    FilterOperator.LT,
                    FilterOperator.LTE,
                ],
                location_type: [FilterOperator.IN, FilterOperator.ILIKE],
                employee_type: [FilterOperator.IN, FilterOperator.CONTAINS],

                //keywords: true,
                keywords: [FilterOperator.IN, FilterOperator.ILIKE],
                'business.industry': [FilterOperator.IN],
            },
            relations: ['business'],
            defaultSortBy: [['created_at', 'DESC']],
            maxLimit: 20,
            defaultLimit: transformedQuery.limit,

            paginationType: PaginationType.TAKE_AND_SKIP,
        };
        const queryBuilder = JobRepository.createQueryBuilder('job').where({
            status: Not(JobStatus.ARCHIVED), // Excludes ARCHIVED
        });

        const jobs = await paginate<Job>(
            transformedQuery,
            queryBuilder,
            paginateConfig,
        );
        return jobs;
    } catch (err) {
        console.error('Error in getting jobs', err);
        throw new AppError('Error in getting jobs', 400);
    }
};

export const changeJobStatus = async (req: Request, status: JobStatus) => {
    const userId = Number(req.user.id);
    const jobId = Number(req.params.id);
    const job = await JobRepository.findOne({
        where: { id: jobId },
        relations: ['business'],
    });
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const isAllowedToUpdateJob = await HrEmployeeRepository.checkPermission(
        userId,

        job.business.id,
        [
            HrRole.SUPER_ADMIN,
            HrRole.HR,
            HrRole.RECRUITER,
            HrRole.HIRING_MANAGER,
            HrRole.SUPER_ADMIN,
            HrRole.OWNER,
        ],
    );
    if (!isAllowedToUpdateJob) {
        throw new AppError('you do not have permission to do that action', 403);
    }
    if (job.status === status) {
        throw new AppError(`Job is already ${status}`, 409);
    }
    job.status = status;
    await JobRepository.save(job);
    return job;
};

export const getAllJobs = async () => {
    return await JobRepository.find();
};

export const loadJobsFromCSV = async () => {
    const mapEmploymentType = (workType: string): EmploymentType => {
        const employmentTypeMap: Record<string, EmploymentType> = {
            'Full-Time': EmploymentType.FullTime,
            'Part-Time': EmploymentType.PartTime,
            Contract: EmploymentType.Contract,
            Intern: EmploymentType.Internship,
            Temporary: EmploymentType.Seasonal, // Assuming "Temporary" maps to "Seasonal"
        };

        // Default to FullTime if no match is found
        return employmentTypeMap[workType] || EmploymentType.FullTime;
    };

    const parseSalary = (salaryRange: string): number => {
        // Remove commas and dollar signs
        const cleanedRange = salaryRange.replace(/[,\$]/g, '');

        // Check if the range contains a hyphen
        if (cleanedRange.includes('-')) {
            const [minStr, maxStr] = cleanedRange.split('-');
            const min =
                parseFloat(minStr.replace('K', '')) *
                (minStr.includes('K') ? 1000 : 1);
            const max =
                parseFloat(maxStr.replace('K', '')) *
                (maxStr.includes('K') ? 1000 : 1);
            return (min + max) / 2;
        } else {
            // Handle single value (e.g., "$59K" or "$59000")
            return (
                parseFloat(cleanedRange.replace('K', '')) *
                (cleanedRange.includes('K') ? 1000 : 1)
            );
        }
    };

    const parseExperience = (experience: string): number => {
        // Extract all numbers from the string
        const numbers = experience.match(/\d+/g)?.map(Number) || [0];

        // Handle single value (e.g., "5 Years" or "5+ Years")
        if (numbers.length === 1) {
            return numbers[0];
        }

        // Calculate the average of the range
        const sum = numbers.reduce((a, b) => a + b, 0);
        return sum / numbers.length;
    };

    fs.createReadStream(path.join(__dirname, '../../job_descriptions.csv'))
        .pipe(csvParser())
        .on('data', async (data) => {
            try {
                const job = new Job();

                job.title = data['Job Title'];
                job.description = `${data['Job Description']}\n\nResponsibilities: ${data['Responsibilities']}\n\nQualifications: ${data['Qualifications']}`;
                job.country = Country[data['Country'] as keyof typeof Country];
                job.city = data['location'];
                job.skills = [data['skills']];
                job.salary = parseSalary(data['Salary Range']);
                job.employee_type = mapEmploymentType(data['Work Type']);
                job.experience = Math.floor(
                    parseExperience(data['Experience']),
                );
                job.keywords = [data['Job Title'], data['skills']];
                job.business_id = 1;
                job.status = JobStatus.OPENED;
                job.extra_application_link = 'text.com';
                job.has_extra_link_application = true;
                await JobRepository.save(job);
                console.log('Job Added');
            } catch (e) {
                console.log('Error saving job');
                console.log(e);
            }
        })
        .on('end', async () => {
            try {
                console.log(`Successfully imported jobs`);
            } catch (error) {
                console.error('Error saving jobs:', error);
            }
        });
};

export const getNumberOfActiveJobsService = async () => {
    const count = await JobRepository.createQueryBuilder('job')
        .where('job.status != :archivedStatus', {
            archivedStatus: JobStatus.ARCHIVED,
        })
        .getCount();
    return count;
};

export const getNumberOfNewlyPostedJobsService = async () => {
    const count = await JobRepository.createQueryBuilder('job')
        .where('job.status != :archivedStatus', {
            archivedStatus: JobStatus.ARCHIVED,
        })
        .andWhere("job.created_at >= NOW() - INTERVAL '1 hour'")
        .getCount();
    return count;
};

export const getAllArchivedJobsService = async (req: Request) => {
    const userId = Number(req.user.id);
    const businessId = Number(req.params.id);
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        throw new AppError('business not found', 404);
    }

    const isAllowedToShowAllApplications =
        await HrEmployeeRepository.checkPermission(userId, business.id, [
            HrRole.SUPER_ADMIN,
            HrRole.HR,
            HrRole.RECRUITER,
            HrRole.HIRING_MANAGER,
            HrRole.OWNER,
        ]);
    if (!isAllowedToShowAllApplications) {
        throw new AppError('you are not allowed to do that action', 403);
    }
    try {
        //console.log('req', req.query);
        const transformedQuery = Paginate(req);
        //console.log('transformedQuery', transformedQuery);
        const paginateConfig: PaginateConfig<Job> = {
            searchableColumns: ['title', 'business.name', 'description'],
            sortableColumns: ['created_at'],
            filterableColumns: {
                location_type: [FilterOperator.IN, FilterOperator.ILIKE],
                employee_type: [FilterOperator.IN, FilterOperator.CONTAINS],
            },
            relations: ['business'],
            defaultSortBy: [['created_at', 'DESC']],
            maxLimit: 20,
            defaultLimit: transformedQuery.limit,

            paginationType: PaginationType.TAKE_AND_SKIP,
        };
        const queryBuilder = JobRepository.createQueryBuilder('job').where({
            status: JobStatus.ARCHIVED, // Excludes ARCHIVED
            business,
        });

        const jobs = await paginate<Job>(
            transformedQuery,
            queryBuilder,
            paginateConfig,
        );
        return jobs;
    } catch (err) {
        throw new AppError('Error in getting jobs', 400);
    }
};

export const getJobDataAndBusiness = async (jobId: number) => {
    const job = await JobRepository.createQueryBuilder('job')
        .leftJoinAndSelect('job.business', 'business')
        .where('job.id = :id', { id: jobId })
        .getOne();
    return job;
};
