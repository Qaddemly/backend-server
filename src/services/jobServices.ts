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
import {
    paginate,
    PaginateConfig,
    PaginationType,
} from '../utils/pagination/typeorm-paginate';
import { JobStatus } from '../enums/jobStatus';
import { Not } from 'typeorm';
import { AccountSavedJobsRepository } from '../Repository/accountSavedJobRepository';
import { TypeOrmErrors } from '../enums/typeOrmErrors';
import { AccountSavedJobs } from '../entity/AccountSavedJobs';

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

export const applyToJobService = async (req: Request) => {
    const userId = Number(req.user.id);
    const jobId = Number(req.params.id);
    const { resume_id } = req.body;
    if (resume_id) {
        const resume = await ResumeRepository.findOneBy({
            id: resume_id,
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
    // const business = await BusinessRepository.findOneBy({
    //     id: job.business.id,
    // });
    // if (!business) {
    //     throw new AppError('Business not found', 404);
    // }
    const isNotAllowedToApplyJob = await HrEmployeeRepository.checkPermission(
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
    if (isNotAllowedToApplyJob) {
        throw new AppError('you do not have permission to that action', 403);
    }
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
            resume_id,
        );
    return newJobApplication;
    // const account =
    //     await AccountRepository.getAccountWithJobApplications(userId);
    // const isJobAlreadyApplied = account.job_applications.some(
    //     (jobApplication) => jobApplication.job.id === jobId,
    // );
    // if (isJobAlreadyApplied) {
    //     throw new AppError('you have already applied to that job', 409);
    // }
    // const jobApplication = new JobApplication();
    // jobApplication.job = job; // Associate job with the application
    // jobApplication.resume = resume;
    // account.job_applications.push(jobApplication);

    // // Save the new job application
    // await JobApplicationRepository.save(jobApplication);

    // const savedUser = await AccountRepository.save(account);
    // return jobApplication;
};

// export const getAllUserJobsApplicationsService = async (req: Request) => {
//     const userId = Number(req.user.id);

//     const account =
//         await AccountRepository.getAccountWithJobApplications(userId);

//     return account.job_applications;
// };
export const getAllUserJobsApplicationsService = async (req: Request) => {
    const userId = Number(req.user.id);
    try {
        const transformedQuery = Paginate(req);
        const paginateConfig: PaginateConfig<JobApplication> = {
            searchableColumns: ['job.title'],
            sortableColumns: ['created_at'],
            //filterableColumns:{id:5},
            relations: ['job'],
            //where: { job: job },
            defaultSortBy: [['created_at', 'DESC']],
            maxLimit: 20,
            defaultLimit: transformedQuery.limit,
            //where: { resume: { account: account } },
            paginationType: PaginationType.TAKE_AND_SKIP,
        };
        const queryBuilder = JobApplicationRepository.createQueryBuilder(
            'job_application',
        )
            .innerJoinAndSelect('job_application.resume', 'resume')
            .where('resume.accountId = :accountId', { accountId: userId });

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

export const getAllJobsApplicationsForJobService = async (req: Request) => {
    const userId = Number(req.user.id);
    const jobId = Number(req.params.jobId);
    const job = await JobRepository.getJobWithBusiness(jobId);
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const business = await BusinessRepository.findOneBy({
        id: job.business.id,
    });
    if (!business) {
        throw new AppError('Business not found', 404);
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
        const paginateConfig: PaginateConfig<JobApplication> = {
            searchableColumns: [
                'resume.account.first_name',
                'resume.account.last_name',
            ],
            sortableColumns: ['created_at'],
            //filterableColumns:{id:5},
            relations: ['job', 'resume', 'resume.account'],
            //where: { job: job },
            defaultSortBy: [['created_at', 'ASC']],
            maxLimit: 20,
            defaultLimit: transformedQuery.limit,

            paginationType: PaginationType.TAKE_AND_SKIP,
        };
        const queryBuilder = JobApplicationRepository.createQueryBuilder(
            'job_application',
        ).where({ job: { id: jobId } });

        const job_applications = await paginate<JobApplication>(
            transformedQuery,
            queryBuilder,
            paginateConfig,
        );
        return job_applications;
    } catch (err) {
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
            sortableColumns: ['salary'],
            filterableColumns: {
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
