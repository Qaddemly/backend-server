import {
    CreateJobApplicationFormQuestionDto,
    CreateJobApplicationDto,
    UpdateJobApplicationFormQuestionDto,
    CreateJobApplicationFormDto,
} from '../dtos/JobApplicationDto';

import { HrRole } from '../enums/HrRole';
import { JobApplicationStateEnum } from '../enums/jobApplicationStateEnum';
import { JobStatus } from '../enums/jobStatus';
import { uploadSingleResume } from '../middlewares/upload.middleWare';
import { ApplicationAnswerModel } from '../models/jobApplicationAnswers';
import { ApplicationQuestionModel } from '../models/jobApplicationQuestion';
import { HrEmployeeRepository } from '../Repository/Business/hrEmployeeRepository';

import { JobRepository } from '../Repository/Job/jobRepository';
import AppError from '../utils/appError';
import catchAsync from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import { AccountRepository } from '../Repository/Account/accountRepository';
import { Paginate } from '../utils/pagination/decorator';
import {
    FilterOperator,
    paginate,
    PaginateConfig,
    PaginationType,
} from '../utils/pagination/typeorm-paginate';
import { eventEmitter } from '../events/eventEmitter';

import { JobApplicationRepository } from '../Repository/Job/jobApplicationRepository';
import { JobApplication } from '../entity/Job/JobApplication/JobApplication';
import { JobApplicationEducation } from '../entity/Job/JobApplication/JobApplicationEducation';
import { JobApplicationEducationRepository } from '../Repository/Job/jobApplicationEducationRepository';
import { JobApplicationExperience } from '../entity/Job/JobApplication/JobApplicationExperience';
import { JobApplicationExperienceRepository } from '../Repository/Job/jobApplicationExperienceRepository';
import { JobApplicationResume } from '../entity/Job/JobApplication/JobApplicationResume';
import { JobApplicationResumeRepository } from '../Repository/Job/jobApplicationResumeRepository';
import { JobApplicationState } from '../entity/Job/JobApplication/JobApplicationStates';
import { JobApplicationStatesRepository } from '../Repository/Job/jobApplicationStateRepository';
import { AccountArchivedJobApplications } from '../entity/Job/JobApplication/AccountArchivedJobApplications';
import { AccountArchivedJobApplicationsRepository } from '../Repository/Job/accountArchivedJobApplicationsRepository';
import { ApplicationQuestionsModel } from '../models/jobApplicationQuestions';
import { ApplicationAnswersModel } from '../models/jobApplicationAnswerss';
import { Job } from '../entity/Job/Job';

export const getJobApplicationFormQuestionsService = async (jobId: number) => {
    const job = await JobRepository.findOne({ where: { id: jobId } });
    if (!job) {
        throw new AppError('Job not found', 404);
    }

    const questions = await ApplicationQuestionsModel.findOne({
        jobId: job.id,
    });

    return { questions: questions.questions, jobId };
};

export const updateJobQuestionsService = async (jobId: number, data: any) => {
    const job = await JobRepository.findOne({ where: { id: jobId } });
    if (!job) {
        throw new AppError('Job not found', 404);
    }

    const questions = await ApplicationQuestionsModel.findOneAndUpdate(
        {
            jobId: job.id,
        },
        data,
        { new: true },
    );

    return { questions: questions.questions };
};

export const applyToJobService = async (
    accountId: number,
    jobId: number,
    data: CreateJobApplicationDto,
) => {
    const job = await JobRepository.findOne({ where: { id: jobId } });

    if (!job) {
        throw new AppError('job not found', 404);
    }
    if (job.status !== JobStatus.OPENED) {
        throw new AppError('jobs no longer accepts responses', 400);
    }
    const isAllowedToDo = await HrEmployeeRepository.checkPermission(
        accountId,
        job.business_id,
        [
            HrRole.SUPER_ADMIN,
            HrRole.HR,
            HrRole.RECRUITER,
            HrRole.HIRING_MANAGER,
            HrRole.SUPER_ADMIN,
            HrRole.OWNER,
        ],
    );
    if (isAllowedToDo) {
        throw new AppError('you do not have permission to that action', 403);
    }
    const account = await AccountRepository.findOneBy({ id: accountId });
    const foundJobApplication = await JobApplicationRepository.findOne({
        where: { account: { id: accountId }, job: { id: job.id } },
    });
    if (foundJobApplication) {
        throw new AppError('you are already apply to this job', 400);
    }
    const newJobApplication = new JobApplication();
    newJobApplication.first_name = data.personalInfo.first_name;
    newJobApplication.last_name = data.personalInfo.last_name;
    newJobApplication.birth_date = data.personalInfo.birth_date;
    newJobApplication.email = data.personalInfo.email;
    newJobApplication.phone = data.personalInfo.phone;

    newJobApplication.languages = data.languages;
    newJobApplication.skills = data.skills;
    newJobApplication.account = account;
    newJobApplication.job = job;
    const jobApplication =
        await JobApplicationRepository.save(newJobApplication);

    const educationPromises = data.educations.map(async (ed) => {
        const education = new JobApplicationEducation();
        education.university = ed.university;
        education.gpa = ed.gpa;
        education.field_of_study = ed.fieldOfStudy;
        education.start_date = ed.startDate;
        education.end_date = ed.endDate;
        education.job_application = jobApplication;

        return await JobApplicationEducationRepository.save(education);
    });
    const educations = await Promise.all(educationPromises);
    console.log('educations', educations);
    const experiencePromises = data.experiences.map(async (exp) => {
        const experience = new JobApplicationExperience();
        experience.company_name = exp.companyName;
        experience.job_title = exp.jobTitle;
        experience.location = exp.location;
        experience.location_type = exp.locationType;
        experience.employment_type = exp.employmentType;
        experience.still_working = exp.stillWorking;
        experience.start_date = exp.startDate;
        experience.end_date = exp.endDate;
        experience.job_application = jobApplication;

        return await JobApplicationExperienceRepository.save(experience);
    });
    const experiences = await Promise.all(experiencePromises);
    const newResume = new JobApplicationResume();
    newResume.name = data.resume?.name;
    newResume.size = data.resume?.size;
    newResume.url = data.resume?.url;
    newResume.job_application = jobApplication;
    const resume = await JobApplicationResumeRepository.save(newResume);

    const answers = await ApplicationAnswersModel.create({
        jobId,
        accountId,
        answers: data.answers,
        jobApplicationId: jobApplication.id,
    });
    const jobApplicationState = new JobApplicationState();
    jobApplicationState.job_application_id = jobApplication.id;
    jobApplicationState.job_application = jobApplication;
    jobApplicationState.state = JobApplicationStateEnum.PENDING;
    await JobApplicationStatesRepository.save(jobApplicationState);

    const accountArchivedJobApplication = new AccountArchivedJobApplications();
    accountArchivedJobApplication.account = account;
    accountArchivedJobApplication.job_application_id = jobApplication.id;
    accountArchivedJobApplication.job_application = jobApplication;
    accountArchivedJobApplication.is_archived = false;
    await AccountArchivedJobApplicationsRepository.save(
        accountArchivedJobApplication,
    );
};

export const uploadJobApplicationResume = uploadSingleResume('resume');
export const savingResumeInDisk = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.file) {
                if (req.file!.fieldname == 'resume') {
                    const resume = req.file;
                    const originalFileName = resume.originalname;
                    const resumeExtension = originalFileName.substring(
                        originalFileName.lastIndexOf('.') + 1,
                    );
                    const resumeName = `resume-${Math.round(
                        Math.random() * 1e9,
                    )}-${Date.now()}.${resumeExtension}`;
                    const resumeDbUrl = `${process.env.BASE_URL}/uploads/jobApplicationResumes/${resumeName}`;
                    // Save the PDF to disk
                    const filePath = `src/uploads/jobApplicationResumes/${resumeName}`;

                    fs.writeFileSync(filePath, resume.buffer);

                    req.body.resume = {
                        url: resumeDbUrl,
                        name: resume.originalname,
                        size: resume.size,
                    };
                }
            }
            next();
        } catch (err) {
            const customError = new AppError('error while saving file');
            customError.stack = err.stack;
            return next(customError);
        }
    },
);

export const getAllJobApplicationsToJobService = async (req: Request) => {
    const accountId = Number(req.user.id);
    const jobId = Number(req.params.jobId);
    const job = await JobRepository.findOne({ where: { id: jobId } });

    if (!job) {
        throw new AppError('job not found', 404);
    }

    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        accountId,
        job.business_id,
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
    try {
        //console.log('req', req.query);
        const transformedQuery = Paginate(req);
        //console.log('transformedQuery', transformedQuery);
        const paginateConfig: PaginateConfig<JobApplication> = {
            //searchableColumns: ['first_name', 'last_name', 'email'],
            sortableColumns: ['created_at'],
            //filterableColumns:{id:5},
            filterableColumns: {
                'job_application_state.state': [FilterOperator.EQ],
            },

            relations: ['job_application_state'],
            where: { job: { id: job.id } },
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
                'ja.first_name',
                'ja.last_name',
                'ja.email',
                'ja.phone',
                'ja.birth_date',
                'ja.skills',
                'ja.languages',
            ])

            // LEFT JOIN Job
            .where('ja.job = :id', {
                id: job.id,
            });
        if (transformedQuery.search) {
            queryBuilder.andWhere(
                `ja.first_name || ' ' || ja.last_name  ILIKE :searchQuery`,
                {
                    searchQuery: `%${transformedQuery.search}%`,
                },
            );
        }
        const jobApplications = await paginate<JobApplication>(
            transformedQuery,
            queryBuilder,
            paginateConfig,
        );

        return jobApplications;
    } catch (err) {
        console.log(err);
        throw new AppError('Error in getting jobApplications', 400);
    }
};

export const getJobApplicationByBusinessService = async (
    accountId: number,
    jobId: number,
    jobApplicationId: number,
) => {
    const job = await JobRepository.findOne({
        where: { id: jobId },
    });
    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        accountId,
        job.business_id,
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
    const jobApplication = await JobApplicationRepository.findOne({
        where: {
            id: jobApplicationId,
            job: { id: job.id },
        },
        relations: [
            'job_application_education',
            'job_application_resume',
            'job_application_experience',
            'job_application_state',
        ],
    });
    if (!jobApplication) {
        throw new AppError('job application not found', 404);
    }
    const questionAnswers = await ApplicationAnswersModel.findOne({
        jobApplicationId,
    });

    return {
        ...jobApplication,
        questionAnswers: questionAnswers,
    };
};

export const updateJobApplicationStateService = async (
    accountId: number,
    jobId: number,
    jobApplicationId: number,
    state: JobApplicationStateEnum,
) => {
    const job = await JobRepository.findOne({
        where: { id: jobId },
        relations: ['business'],
    });

    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        accountId,
        job.business_id,
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
    const jobApplication = await JobApplicationRepository.findOne({
        where: {
            id: jobApplicationId,
            job: { id: job.id },
        },
        relations: ['account'],
    });
    if (!jobApplication) {
        throw new AppError('job application not found', 404);
    }
    const jobApplicationState = await JobApplicationStatesRepository.findOne({
        where: {
            job_application_id: jobApplicationId,
        },
    });
    jobApplicationState.state = state;
    eventEmitter.emit('sendUpdateJobApplicationStatusNotification', {
        id: jobApplication.id,
        account_id: jobApplication.account.id,
        job: job,
        business: job.business,
        state: jobApplicationState.state,
    });
    return await JobApplicationStatesRepository.save(jobApplicationState);
};

export const getAccountJobApplicationByIdService = async (
    accountId: number,
    jobApplicationId: number,
) => {
    const jobApplication = await JobApplicationRepository.findOne({
        where: {
            id: jobApplicationId,
            account: { id: accountId },
        },
        relations: [
            'job_application_education',
            'job_application_experience',
            'job_application_resume',
            'job_application_state',
            'job',
        ],
    });
    if (!jobApplication) {
        throw new AppError('job application not found', 404);
    }
    const questionAnswers = await ApplicationAnswersModel.findOne({
        jobApplicationId,
    });
    return {
        ...jobApplication,
        questionAnswers: questionAnswers.answers,
    };
};

export const getAllJobApplicationByAccountIdService = async (req: Request) => {
    const accountId = Number(req.user.id);
    try {
        //console.log('req', req.query);
        const transformedQuery = Paginate(req);
        //console.log('transformedQuery', transformedQuery);
        const paginateConfig: PaginateConfig<JobApplication> = {
            searchableColumns: ['job.title'],
            sortableColumns: ['created_at'],
            //filterableColumns:{id:5},
            filterableColumns: {
                'job_application_state.state': [FilterOperator.EQ],
            },

            relations: ['job_application_state', 'job'],
            defaultSortBy: [['created_at', 'DESC']],
            maxLimit: 20,
            defaultLimit: transformedQuery.limit,

            paginationType: PaginationType.TAKE_AND_SKIP,
        };
        const queryBuilder = JobApplicationRepository.createQueryBuilder('cjas')
            .select([
                'cjas.id',
                'cjas.created_at',
                'cjas.updated_at',
                'cjas.first_name',
                'cjas.last_name',
                'cjas.email',
                'cjas.phone',
                'cjas.birth_date',
                'cjas.skills',
                'cjas.languages',
            ])

            // LEFT JOIN Job
            .leftJoin(
                'cjas.account_archived_job_application',
                'account_archived_job_application',
            )
            .where('cjas.account_id = :id', {
                id: accountId,
            })
            .andWhere('account_archived_job_application.is_archived = false');
        const jobApplication = await paginate<JobApplication>(
            transformedQuery,
            queryBuilder,
            paginateConfig,
        );
        jobApplication.data.map((csa) => {
            delete csa.account;
            //delete csa.job;
        });
        return jobApplication;
    } catch (err) {
        console.log(err);
        throw new AppError('Error in getting jobApplication', 400);
    }
};

export const archiveJobApplicationService = async (
    accountId: number,
    jobApplicationId: number,
    archive: boolean,
) => {
    const jobApplicationArchive =
        await AccountArchivedJobApplicationsRepository.findOne({
            where: {
                account: { id: accountId },
                job_application_id: jobApplicationId,
            },
        });
    if (!jobApplicationArchive) {
        throw new AppError('job application not found', 404);
    }
    if (
        (archive && jobApplicationArchive.is_archived) ||
        (!archive && jobApplicationArchive.is_archived == false)
    ) {
        throw new AppError('Job Application already in the desired state', 400);
    }
    jobApplicationArchive.is_archived = archive;
    return await AccountArchivedJobApplicationsRepository.save(
        jobApplicationArchive,
    );
};

export const getAllArchivedApplicationsOfUserService = (accountId: number) => {
    return AccountArchivedJobApplicationsRepository.find({
        where: {
            account: { id: accountId },
            is_archived: true,
        },
        relations: ['job_application'],
        order: { created_at: 'DESC' },
    });
};
