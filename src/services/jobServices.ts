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
import { ApiFeatures } from '../utils/apiFeatures';
import { Paginate } from '../utils/pagination/decorator';
import {
    FilterComparator,
    FilterOperator,
    FilterSuffix,
} from '../utils/pagination/filter';
import {
    paginate,
    PaginateConfig,
    PaginationType,
} from '../utils/pagination/typeorm-paginate';
import { transformFilter } from '../utils/pagination/transformQuery';

export const createJobService = async (
    req: Request<{}, {}, CreateJobBodyBTO>,
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
        ],
    );
    if (!isAllowedToPostJob) {
        throw new AppError('you do not have permission to that action', 403);
    }
    const newJob = new Job();
    newJob.title = title;
    newJob.description = description;
    newJob.location = location;
    newJob.location_type = location_type;
    newJob.skills = skills;
    newJob.salary = salary;
    newJob.employee_type = employee_type;
    newJob.keywords = keywords;
    newJob.experience = experience;
    newJob.business = business;
    await JobRepository.save(newJob);
    const returnedJob: { [key: string]: any } = newJob;
    delete returnedJob.business;
    returnedJob.business_id = business_id;
    return returnedJob;
};

export const getOneJobService = async (req: Request) => {
    const jobId = Number(req.params.id);
    const job = await JobRepository.findJobDetails(jobId);
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    return job;
};

export const updateJobService = async (
    req: Request<{ id: string }, {}, CreateJobBodyBTO>,
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
    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        userId,

        foundedJob.business.id,
        [
            HrRole.SUPER_ADMIN,
            HrRole.HR,
            HrRole.RECRUITER,
            HrRole.HIRING_MANAGER,
            HrRole.SUPER_ADMIN,
        ],
    );
    if (!isAllowedToPostJob) {
        throw new AppError('you do not have permission to post job', 403);
    }

    const job = await JobRepository.updateOneJob(jobId, {
        title: title,
        description: description,
        location: location,
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

export const saveJobToUserService = async (req: Request) => {
    const userId = Number(req.user.id);
    const jobId = Number(req.params.id);
    const job = await JobRepository.findOneBy({ id: jobId });
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const account = await AccountRepository.getAccountWithSavedJobs(userId);
    const isJobAlreadySaved = account.saved_jobs.some(
        (savedJob) => savedJob.id === jobId,
    );
    if (isJobAlreadySaved) {
        throw new AppError('Job already saved', 409);
    }
    account.saved_jobs.push(job);
    const savedUser = await AccountRepository.save(account);
    return savedUser.saved_jobs;
};

export const removeSavedJobFromUserService = async (req: Request) => {
    const userId = Number(req.user.id);
    const jobId = Number(req.params.id);
    const job = await JobRepository.findOneBy({ id: jobId });
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const account = await AccountRepository.getAccountWithSavedJobs(userId);
    const isJobAlreadySaved = account.saved_jobs.some(
        (savedJob) => savedJob.id === jobId,
    );
    if (!isJobAlreadySaved) {
        throw new AppError('Job already not saved', 409);
    }
    account.saved_jobs = account.saved_jobs.filter((job) => job.id !== jobId);

    const savedUser = await AccountRepository.save(account);
    return savedUser;
};

export const getAllUserSavedJobsService = async (req: Request) => {
    const userId = Number(req.user.id);

    const account = await AccountRepository.getAccountWithSavedJobs(userId);

    return account.saved_jobs;
};

export const applyToJobService = async (req: Request) => {
    const userId = Number(req.user.id);
    const jobId = Number(req.params.id);
    const { resume_id } = req.body;
    const resume = await ResumeRepository.findOneBy({
        id: resume_id,
        account: { id: userId },
    });
    if (!resume) {
        throw new AppError('Resume not found', 404);
    }
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
    const isNotAllowedToApplyJob = await HrEmployeeRepository.checkPermission(
        userId,
        business.id,
        [
            HrRole.SUPER_ADMIN,
            HrRole.HR,
            HrRole.RECRUITER,
            HrRole.HIRING_MANAGER,
            HrRole.SUPER_ADMIN,
        ],
    );
    if (isNotAllowedToApplyJob) {
        throw new AppError('you do not have permission to that action', 403);
    }

    const account =
        await AccountRepository.getAccountWithJobApplications(userId);
    const isJobAlreadyApplied = account.job_applications.some(
        (jobApplication) => jobApplication.job.id === jobId,
    );
    if (isJobAlreadyApplied) {
        throw new AppError('you have already applied to that job', 409);
    }
    const jobApplication = new JobApplication();
    jobApplication.job = job; // Associate job with the application
    jobApplication.resume = resume;
    account.job_applications.push(jobApplication);

    // Save the new job application
    await JobApplicationRepository.save(jobApplication);

    const savedUser = await AccountRepository.save(account);
    return jobApplication;
};

export const getAllUserJobsApplicationsService = async (req: Request) => {
    const userId = Number(req.user.id);

    const account =
        await AccountRepository.getAccountWithJobApplications(userId);

    return account.job_applications;
};

export const getAllJobsApplicationsForJobService = async (req: Request) => {
    const userId = Number(req.user.id);
    const jobId = Number(req.params.id);
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
            HrRole.SUPER_ADMIN,
        ]);
    if (!isAllowedToShowAllApplications) {
        throw new AppError('you are not allowed to show all applications', 403);
    }

    const job_applications =
        await JobApplicationRepository.findAllApplicationsByJobId(jobId);

    return job_applications;
};

export const getAllJobsService = async (req: Request) => {
    try {
        console.log('req', req.query);
        const transformedQuery = Paginate(req);
        console.log('transformedQuery', transformedQuery);
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
        const queryBuilder = JobRepository.createQueryBuilder('job');

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
