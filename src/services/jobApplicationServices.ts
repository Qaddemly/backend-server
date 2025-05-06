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
import { JobApplicationFormRepository } from '../Repository/Job/jobApplicationFormRepository';
import { JobApplicationForm } from '../entity/Job/JobApplication/JobApplicationForm';
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
export const createJobApplicationFormService = async (
    userId: number,
    jobId: number,
    data: CreateJobApplicationFormDto,
) => {
    const job = await JobRepository.findOne({
        where: { id: jobId },
        relations: ['business'],
    });
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
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
    if (!isAllowedToPostJob) {
        throw new AppError('you do not have permission to that action', 403);
    }

    const foundJobApplicationForm = await JobApplicationFormRepository.findOne({
        where: { job_id: jobId },
    });
    if (foundJobApplicationForm) {
        throw new AppError(
            ' job application form already exists for this job',
            400,
        );
    }
    const newJobApplicationForm = new JobApplicationForm();
    newJobApplicationForm.job = job;
    newJobApplicationForm.job_id = jobId;
    const cs = await JobApplicationFormRepository.save(newJobApplicationForm);
    const questionsPromises = data.questions.map(async (q) => {
        const question = await ApplicationQuestionModel.create({
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options,
            isRequired: q.isRequired,
            order: q.order,
            jobId: jobId,
            jobApplicationFormId: cs.id,
        });
        return question;
    });
    const questions = await Promise.all(questionsPromises);
    const customJobApplicationForm = {
        id: cs.id,
        job_id: jobId,
        questions: questions,
    };
    return customJobApplicationForm;
};

export const getJobApplicationFormService = async (jobId: number) => {
    const job = await JobRepository.findOne({ where: { id: jobId } });
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const jobApplicationForm = await JobApplicationFormRepository.findOne({
        where: { job_id: jobId },
    });
    if (!jobApplicationForm) {
        throw new AppError(' job application form not found', 404);
    }
    const questions = await ApplicationQuestionModel.find({
        jobApplicationFormId: jobApplicationForm.id,
    }).sort({ order: 1 });
    jobApplicationForm.job = job;
    const jobApplicationFormWithQuestions = {
        ...jobApplicationForm,
        questions: questions,
    };
    return jobApplicationFormWithQuestions;
};

export const applyToJobService = async (
    accountId: number,
    jobId: number,
    data: CreateJobApplicationDto,
) => {
    const jobApplicationForm = await JobApplicationFormRepository.findOne({
        where: { job_id: jobId },
        relations: ['job'],
    });
    if (!jobApplicationForm) {
        throw new AppError('job application form not found', 404);
    }
    if (jobApplicationForm.job.status !== JobStatus.OPENED) {
        throw new AppError('jobs no longer accepts responses', 400);
    }
    const isAllowedToDo = await HrEmployeeRepository.checkPermission(
        accountId,
        jobApplicationForm.job.business_id,
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
        where: {
            account: { id: accountId },
            job_application_form: { id: jobApplicationForm.id },
        },
    });

    if (foundJobApplication) {
        throw new AppError('you have already applied to this job');
    }
    const newJobApplication = new JobApplication();
    newJobApplication.first_name = data.personalInfo.first_name;
    newJobApplication.last_name = data.personalInfo.last_name;
    newJobApplication.birth_date = data.personalInfo.birth_date;
    newJobApplication.email = data.personalInfo.email;
    newJobApplication.phone = data.personalInfo.phone;

    newJobApplication.job_application_form = jobApplicationForm;
    newJobApplication.languages = data.languages;
    newJobApplication.skills = data.skills;
    newJobApplication.account = account;
    newJobApplication.job = jobApplicationForm.job;
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

    const answerPromises = data.answers.map(async (ans) => {
        const answer = await ApplicationAnswerModel.create({
            answer: ans.answer,
            question: ans.questionId,
            accountId: account.id,
            jobApplicationFormId: jobApplicationForm.id,
            jobApplicationId: jobApplication.id,
        });
        return answer;
    });
    const answers = await Promise.all(answerPromises);

    const jobApplicationState = new JobApplicationState();
    jobApplicationState.job_application_id = jobApplication.id;
    jobApplicationState.job_application = jobApplication;
    jobApplicationState.state = JobApplicationStateEnum.PENDING;
    await JobApplicationStatesRepository.save(jobApplicationState);

    const accountArchivedJobApplication = new AccountArchivedJobApplications();
    accountArchivedJobApplication.account = account;
    accountArchivedJobApplication.job_application_id = jobApplication.id;
    accountArchivedJobApplication.job_application_form = jobApplicationForm;
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
    const jobApplicationForm = await JobApplicationFormRepository.findOne({
        where: { job_id: jobId },
        relations: ['job'],
    });
    if (!jobApplicationForm) {
        throw new AppError('job application form not found', 404);
    }

    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        accountId,
        jobApplicationForm.job.business_id,
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

            relations: ['job_application_state', 'job_application_form'],
            where: { job_application_form: { id: jobApplicationForm.id } },
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
                'ja.job_application_form_id',
            ])

            // LEFT JOIN Job
            .where('ja.job_application_form_id = :id', {
                id: jobApplicationForm.id,
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
        relations: ['job_application_form'],
    });
    const jobApplicationForm = job.job_application_form;
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
            job_application_form: { id: jobApplicationForm.id },
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
    const questionAnswers = await ApplicationAnswerModel.find({
        jobApplicationId,
    })

        .populate('question');
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
        relations: ['job_application_form', 'business'],
    });
    const jobApplicationForm = job.job_application_form;

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
            job_application_form: jobApplicationForm,
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

export const deleteJobApplicationFormService = async (
    accountId: number,
    jobId: number,
) => {
    const jobApplicationForm = await JobApplicationFormRepository.findOne({
        where: { job_id: jobId },
        relations: ['job'],
    });
    if (!jobApplicationForm) {
        throw new AppError('job application form not found', 404);
    }
    const jobApplicationFormId = jobApplicationForm.id;

    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        accountId,
        jobApplicationForm.job.business_id,
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

    await JobApplicationFormRepository.delete({ id: jobApplicationFormId });
    await ApplicationQuestionModel.deleteMany({
        jobApplicationFormId: jobApplicationFormId,
    });
    await ApplicationAnswerModel.deleteMany({ jobApplicationFormId });
};

export const addQuestionToJobApplicationFormService = async (
    accountId: number,
    jobApplicationFormId: number,
    data: CreateJobApplicationFormQuestionDto,
) => {
    const jobApplicationForm = await JobApplicationFormRepository.findOne({
        where: { id: jobApplicationFormId },
        relations: ['job'],
    });
    if (!jobApplicationForm) {
        throw new AppError('job application form not found', 404);
    }
    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        accountId,
        jobApplicationForm.job.business_id,
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
    const question = await ApplicationQuestionModel.create({
        questionText: data.questionText,
        questionType: data.questionType,
        options: data.options,
        isRequired: data.isRequired,
        order: data.order,
        jobId: jobApplicationForm.job_id,
        jobApplicationFormId: jobApplicationForm.id,
    });
    return question;
};

export const updateQuestionFromJobApplicationService = async (
    accountId: number,
    jobApplicationFormId: number,
    questionId: string,
    data: UpdateJobApplicationFormQuestionDto,
) => {
    const jobApplicationForm = await JobApplicationFormRepository.findOne({
        where: { id: jobApplicationFormId },
        relations: ['job'],
    });
    if (!jobApplicationForm) {
        throw new AppError('job application not found', 404);
    }
    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        accountId,
        jobApplicationForm.job.business_id,
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
    const question = await ApplicationQuestionModel.findOneAndUpdate(
        {
            _id: questionId,
        },
        data,
        { new: true },
    );
    if (!question) {
        throw new AppError('question not found', 404);
    }
    return question;
};

export const deleteQuestionFromJobApplicationService = async (
    accountId: number,
    jobApplicationFormId: number,
    questionId: string,
) => {
    const jobApplicationForm = await JobApplicationFormRepository.findOne({
        where: { id: jobApplicationFormId },
        relations: ['job'],
    });
    if (!jobApplicationForm) {
        throw new AppError('job application not found', 404);
    }
    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        accountId,
        jobApplicationForm.job.business_id,
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
    const question = await ApplicationQuestionModel.findOneAndDelete({
        _id: questionId,
    });
    if (!question) {
        throw new AppError('question not found', 404);
    }
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
    const questionAnswers = await ApplicationAnswerModel.find({
        jobApplicationId,
    }).populate('question');
    return {
        ...jobApplication,
        job: jobApplication.job,
        questionAnswers: questionAnswers,
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

            relations: ['job_application_state', 'job_application_form', 'job'],
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
                'cjas.job_application_form_id',
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
