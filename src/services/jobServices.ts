import { Request } from 'express';
import { CreateJobBodyBTO } from '../dtos/jobDto';
import { BusinessRepository } from '../Repository/businessRepository';
import AppError from '../utils/appError';
import { Job } from '../entity/Job';
import { JobRepository } from '../Repository/jobRepository';
import { HrEmployeeRepository } from '../Repository/hrEmployeeRepository';
import { HrRole } from '../enums/HrRole';
import { AccountRepository } from '../Repository/accountRepository';
import { JobApplication } from '../entity/JobApplication';
import { ResumeRepository } from '../Repository/resumeRepository';
import { JobApplicationRepository } from '../Repository/jobApplicationRepository';
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
import { JobApplicationState } from '../entity/JobApplicationStates';
import { AccountArchivedJobApplications } from '../entity/AccountArchivedJobApplications';
import { Account } from '../entity/Account';
import { JobApplicationStateEnum } from '../enums/jobApplicationStateEnum';
import { JobApplicationStatesRepository } from '../Repository/jobApplicationStatesRepository';
import { AccountArchivedJobApplicationsRepository } from '../Repository/accountArchivedJobApplicationsRepository';
import { getUserInfoToRecommendJobs } from './profileServices';
import { AccountSavedJobsRepository } from '../Repository/accountSavedJobRepository';
import { AccountSavedJobs } from '../entity/AccountSavedJobs';
import { EmploymentType } from '../enums/employmentType';
import fs from 'fs';
import { Country } from '../enums/country';
import path from 'path';
import { redisClient } from '../config/redis';

export const createJobService = async (
    req: Request<{}, {}, CreateJobBodyBTO>,
) => {
    const {
        title,
        description,
        country,
        city,
        location_type,
        skills,
        salary,
        employee_type,
        keywords,
        experience,
        business_id,
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
    newJob.country = country;
    newJob.city = city;
    newJob.location_type = location_type;
    newJob.skills = skills;
    newJob.salary = salary;
    newJob.employee_type = employee_type;
    newJob.keywords = keywords;
    newJob.experience = experience;
    newJob.business = business;
    console.log('newJob', newJob);
    return await JobRepository.save(newJob);
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
    req: Request<{ id: string }, {}, CreateJobBodyBTO>,
) => {
    const {
        title,
        description,
        country,
        city,
        location_type,
        skills,
        salary,
        employee_type,
        keywords,
        experience,
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

    const job = await JobRepository.updateOneJob(jobId, {
        title: title,
        description: description,
        country: country,
        city: city,
        location_type: location_type,
        skills: skills,
        salary: salary,
        employee_type: employee_type,
        keywords: keywords,
        experience: experience,
    });
    // const returnedJob: { [key: string]: any } = job;
    // delete returnedJob.business;
    // returnedJob.business_id = business_id;
    return job;
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

export const applyToJobService = async (
    userId: number,
    jobId: number,
    resumeId: number,
) => {
    if (resumeId) {
        const resume = await ResumeRepository.findOneBy({
            id: resumeId,
            account: { id: userId },
        });
        if (!resume) {
            throw new AppError('Resume not found', 404);
        }
    }
    const job = await JobRepository.getJobWithBusiness(jobId);
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    if (job.status != JobStatus.OPENED) {
        throw new AppError('job is no longer available ', 400);
    }

    // const isNotAllowedToApplyJob = await HrEmployeeRepository.checkPermission(
    //     userId,
    //     job.business.id,
    //     [
    //         HrRole.SUPER_ADMIN,
    //         HrRole.HR,
    //         HrRole.RECRUITER,
    //         HrRole.HIRING_MANAGER,
    //         HrRole.SUPER_ADMIN,
    //         HrRole.OWNER,
    //     ],
    // );
    // if (isNotAllowedToApplyJob) {
    //     throw new AppError('you do not have permission to that action', 403);
    // }

    const jobApplication =
        await JobApplicationRepository.findOneByAccountIdAndJobId(
            userId,
            jobId,
        );
    if (jobApplication) {
        throw new AppError('you have already applied to that job', 409);
    }
    const newJobApplication =
        await JobApplicationRepository.createJobApplication(
            userId,
            jobId,
            resumeId,
        );
    const jobApplicationState = new JobApplicationState();
    jobApplicationState.job_application_id = newJobApplication.id;
    jobApplicationState.job = { id: jobId } as Job;
    jobApplicationState.state = JobApplicationStateEnum.PENDING;
    await JobApplicationStatesRepository.save(jobApplicationState);

    const accountArchivedJobApplication = new AccountArchivedJobApplications();
    accountArchivedJobApplication.account = { id: userId } as Account;
    accountArchivedJobApplication.job_application_id = newJobApplication.id;
    accountArchivedJobApplication.is_archived = false;
    await AccountArchivedJobApplicationsRepository.save(
        accountArchivedJobApplication,
    );

    return newJobApplication;
};

export const getAllUserJobsApplicationsService = async (req: Request) => {
    const userId = Number(req.user.id);
    try {
        const transformedQuery = Paginate(req);
        const paginateConfig: PaginateConfig<JobApplication> = {
            searchableColumns: ['job.title'],
            sortableColumns: ['created_at'],
            //filterableColumns:{id:5},
            filterableColumns: {
                'job_application_state.state': [FilterOperator.EQ],
            },
            relations: ['job', 'job_application_state'],
            //where: { job: job },

            defaultSortBy: [['created_at', 'DESC']],
            maxLimit: 20,
            defaultLimit: transformedQuery.limit,
            where: { account: { id: userId } },
            paginationType: PaginationType.TAKE_AND_SKIP,
        };
        const queryBuilder = JobApplicationRepository.createQueryBuilder('ja')
            .select([
                'ja.id',
                'ja.created_at',
                'ja.updated_at',
                // Account fields
                'a.id',
                'a.address.country',
                'a.address.city',
                'a.phone.number',
                'a.phone.country_code',
                'a.first_name',
                'a.last_name',
                'a.email',
                'a.profile_picture',
                'a.about_me',
                'a.date_of_birth',
                'a.country',
                'a.country_code',
                'a.city',
                'a.number',
                'a.subtitle',
                // Job fields
                // Resume fields
                'resume',
                //'bus.address',
            ])
            .leftJoin('ja.account', 'a') // LEFT JOIN Account

            .leftJoin('ja.resume', 'resume') // LEFT JOIN Account
            .leftJoin('ja.archived_job_application', 'archived_job_application')
            .where('a.id = :id', { id: userId })
            .andWhere('archived_job_application.is_archived = false');
        //   console.log(await queryBuilder.getRawMany());
        const job_applications = await paginate<JobApplication>(
            transformedQuery,
            queryBuilder,
            paginateConfig,
        );
        return job_applications;
    } catch (err) {
        console.error('Error in getting job_applications', err);
        throw new AppError('Error in getting job_applications', 400);
    }
};

export const getOneUserJobApplicationService = async (
    accountId: number,
    jobApplicationId: number,
) => {
    const jobApplication =
        await JobApplicationRepository.getOneJobApplication(jobApplicationId);

    if (!jobApplication || jobApplication.account.id !== accountId) {
        throw new AppError('Job Application not found', 404);
    }
    return jobApplication;
};

export const getOneJobApplicationService = async (
    accountId: number,
    jobApplicationId: number,
) => {
    const jobApplication =
        await JobApplicationRepository.getOneJobApplication(jobApplicationId);

    if (!jobApplication) {
        throw new AppError('Job Application not found', 404);
    }
    const isAllowedToShowAllApplications =
        await HrEmployeeRepository.checkPermission(
            accountId,
            jobApplication.job.business.id,
            [
                HrRole.SUPER_ADMIN,
                HrRole.HR,
                HrRole.RECRUITER,
                HrRole.HIRING_MANAGER,
                HrRole.OWNER,
            ],
        );
    if (!isAllowedToShowAllApplications) {
        throw new AppError('you are not allowed to do that action', 403);
    }
    return jobApplication;
};
export const getAllJobsApplicationsForJobService = async (req: Request) => {
    const userId = Number(req.user.id);
    const jobId = Number(req.params.id);
    const job = await JobRepository.getJobWithBusiness(jobId);
    if (!job) {
        throw new AppError('Job not found', 404);
    }

    const isAllowedToShowAllApplications =
        await HrEmployeeRepository.checkPermission(userId, job.business.id, [
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
        const paginateConfig: PaginateConfig<JobApplication> = {
            searchableColumns: [
                'account.first_name',
                'account.last_name',
                'account.email',
            ],
            sortableColumns: ['created_at'],
            //filterableColumns:{id:5},
            filterableColumns: {
                'job_application_state.state': [FilterOperator.EQ],
            },

            relations: ['account', 'job', 'job_application_state'],
            where: { job: { id: jobId } },
            defaultSortBy: [['created_at', 'ASC']],
            maxLimit: 20,
            defaultLimit: transformedQuery.limit,

            paginationType: PaginationType.TAKE_AND_SKIP,
        };
        const queryBuilder = JobApplicationRepository.createQueryBuilder('ja')
            .select([
                'ja.id',
                'ja.created_at',
                'ja.updated_at',
                // Account fields
                // 'a.id',
                // 'a.address.country',
                // 'a.address.city',
                // 'a.phone.number',
                // 'a.phone.country_code',
                // 'a.first_name',
                // 'a.last_name',
                // 'a.email',
                // 'a.profile_picture',
                // 'a.about_me',
                // 'a.date_of_birth',
                // 'a.country',
                // 'a.country_code',
                // 'a.city',
                // 'a.number',
                // 'a.subtitle',
                // Job fields
                // Resume fields
                'resume',
                //'bus.address',
            ])
            // .leftJoin('ja.account', 'a') // LEFT JOIN Account
            .leftJoin('ja.resume', 'resume') // LEFT JOIN Account
            .leftJoin('ja.job', 'job') // LEFT JOIN Job
            .where('job.id = :id', { id: jobId });

        const job_applications = await paginate<JobApplication>(
            transformedQuery,
            queryBuilder,
            paginateConfig,
        );
        return job_applications;
    } catch (err) {
        console.log(err);
        throw new AppError('Error in getting job_applications', 400);
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

export const getRecommendedJobsForUserService = async (userId: number) => {
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
        const response = await axios.post('http://localhost:8001/recommend', {
            user: userInfo,
            jobs,
        });
        console.log('response', response.data);

        // @ts-ignore
        for (let i = 0; i < response.data.length; i++) {
            // @ts-ignore
            // const job = await JobRepository.findOne({
            //     // @ts-ignore
            //     where: { id: response.data[i].id },
            // });
            const job = await JobRepository.createQueryBuilder('job')
                .where('job.id = :id', { id: response.data[i].id })
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
                job.experience = parseExperience(data['Experience']);
                job.keywords = [data['Job Title'], data['skills']];
                job.business_id = 1;
                job.status = JobStatus.OPENED;
                console.log('job', job);
                await JobRepository.save(job);
            } catch (e) {
                console.log('Error saving job');
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
