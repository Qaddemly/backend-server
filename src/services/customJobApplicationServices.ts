import {
    CreateCustomJobApplicationDto,
    CreateCustomJobApplicationSubmitDto,
} from '../dtos/customJobApplicationDto';
import { AccountArchivedCustomJobApplications } from '../entity/Job/customJobApplication/AccountArchivedCustomJobApplications';
import { CustomJobApplication } from '../entity/Job/customJobApplication/CustomJobApplication';
import { CustomJobApplicationEducation } from '../entity/Job/customJobApplication/CustomJobApplicationEducation';
import { CustomJobApplicationExperience } from '../entity/Job/customJobApplication/CustomJobApplicationExperience';
import { CustomJobApplicationResume } from '../entity/Job/customJobApplication/CustomJobApplicationResume';
import { CustomJobApplicationState } from '../entity/Job/customJobApplication/CustomJobApplicationStates';
import { CustomJobApplicationSubmit } from '../entity/Job/customJobApplication/CustomJobApplicationSubmit';
import { HrRole } from '../enums/HrRole';
import { JobApplicationStateEnum } from '../enums/jobApplicationStateEnum';
import { JobStatus } from '../enums/jobStatus';
import { uploadSingleResume } from '../middlewares/upload.middleWare';
import { ApplicationAnswerModel } from '../models/customJobApplicationAnswers';
import { ApplicationQuestionModel } from '../models/customJobApplicationQuestion';
import { HrEmployeeRepository } from '../Repository/Business/hrEmployeeRepository';
import { AccountArchivedCustomJobApplicationsRepository } from '../Repository/Job/accountArchivedCustomJobApplicationsRepository';
import { CustomJobApplicationEducationRepository } from '../Repository/Job/customJobApplicationEducationRepository';
import { CustomJobApplicationExperienceRepository } from '../Repository/Job/customJobApplicationExperienceRepository';
import { CustomJobApplicationRepository } from '../Repository/Job/customJobApplicationRepository';
import { CustomJobApplicationResumeRepository } from '../Repository/Job/customJobApplicationResumeRepository';
import { CustomJobApplicationStatesRepository } from '../Repository/Job/customJobApplicationStateRepository';
import { CustomJobApplicationSubmitRepository } from '../Repository/Job/customJobApplicationSubmitRepository';
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
export const createCustomJobApplicationService = async (
    userId: number,
    jobId: number,
    data: CreateCustomJobApplicationDto,
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

    const foundCustomJobApplication =
        await CustomJobApplicationRepository.findOne({
            where: { job_id: jobId },
        });
    if (foundCustomJobApplication) {
        throw new AppError(
            'Custom job application already exists for this job',
            400,
        );
    }
    const newCustomJobApplication = new CustomJobApplication();
    newCustomJobApplication.job = job;
    newCustomJobApplication.job_id = jobId;
    const cs = await CustomJobApplicationRepository.save(
        newCustomJobApplication,
    );
    const questionsPromises = data.questions.map(async (q) => {
        const question = await ApplicationQuestionModel.create({
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options,
            isRequired: q.isRequired,
            order: q.order,
            jobId: jobId,
            customJobApplicationId: cs.id,
        });
        return question;
    });
    const questions = await Promise.all(questionsPromises);
    const customJobApplication = {
        id: cs.id,
        job_id: jobId,
        questions: questions,
    };
    return customJobApplication;
};

export const getCustomJobApplicationService = async (jobId: number) => {
    const job = await JobRepository.findOne({ where: { id: jobId } });
    if (!job) {
        throw new AppError('Job not found', 404);
    }
    const customJobApplication = await CustomJobApplicationRepository.findOne({
        where: { job_id: jobId },
    });
    if (!customJobApplication) {
        throw new AppError('Custom job application not found', 404);
    }
    const questions = await ApplicationQuestionModel.find({
        customJobApplicationId: customJobApplication.id,
    });
    customJobApplication.job = job;
    const customJobApplicationWithQuestions = {
        ...customJobApplication,
        questions: questions,
    };
    return customJobApplicationWithQuestions;
};

export const createCustomJobApplicationSubmitService = async (
    accountId: number,
    customJobApplicationId: number,
    data: CreateCustomJobApplicationSubmitDto,
) => {
    const customJobApplication = await CustomJobApplicationRepository.findOne({
        where: { id: customJobApplicationId },
        relations: ['job'],
    });
    if (!customJobApplication) {
        throw new AppError('job application not found', 404);
    }
    if (customJobApplication.job.status !== JobStatus.OPENED) {
        throw new AppError('jobs no longer accepts responses', 400);
    }
    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        accountId,
        customJobApplication.job.business_id,
        [
            HrRole.SUPER_ADMIN,
            HrRole.HR,
            HrRole.RECRUITER,
            HrRole.HIRING_MANAGER,
            HrRole.SUPER_ADMIN,
            HrRole.OWNER,
        ],
    );
    if (isAllowedToPostJob) {
        throw new AppError('you do not have permission to that action', 403);
    }
    const account = await AccountRepository.findOneBy({ id: accountId });

    const foundCustomJobApplicationSubmit =
        await CustomJobApplicationSubmitRepository.findOne({
            where: {
                account: { id: accountId },
                custom_job_application: { id: customJobApplicationId },
            },
        });

    if (foundCustomJobApplicationSubmit) {
        throw new AppError('you have already applied to this job');
    }
    const newCustomJobApplicationSubmit = new CustomJobApplicationSubmit();
    newCustomJobApplicationSubmit.first_name = data.personalInfo.first_name;
    newCustomJobApplicationSubmit.last_name = data.personalInfo.last_name;
    newCustomJobApplicationSubmit.birth_date = data.personalInfo.birth_date;
    newCustomJobApplicationSubmit.email = data.personalInfo.email;
    newCustomJobApplicationSubmit.phone = data.personalInfo.phone;
    newCustomJobApplicationSubmit.custom_job_application_id =
        customJobApplication.id;
    newCustomJobApplicationSubmit.custom_job_application = customJobApplication;
    newCustomJobApplicationSubmit.languages = data.languages;
    newCustomJobApplicationSubmit.skills = data.skills;
    newCustomJobApplicationSubmit.account = account;
    const customJobApplicationSubmit =
        await CustomJobApplicationSubmitRepository.save(
            newCustomJobApplicationSubmit,
        );

    const educationPromises = data.educations.map(async (ed) => {
        const education = new CustomJobApplicationEducation();
        education.university = ed.university;
        education.gpa = ed.gpa;
        education.field_of_study = ed.fieldOfStudy;
        education.start_date = ed.startDate;
        education.end_date = ed.endDate;
        education.custom_job_application_submit = customJobApplicationSubmit;
        education.custom_job_application_submit_id =
            customJobApplicationSubmit.id;

        return await CustomJobApplicationEducationRepository.save(education);
    });
    const educations = await Promise.all(educationPromises);
    const experiencePromises = data.experiences.map(async (exp) => {
        const experience = new CustomJobApplicationExperience();
        experience.company_name = exp.companyName;
        experience.job_title = exp.jobTitle;
        experience.location = exp.location;
        experience.location_type = exp.locationType;
        experience.employment_type = exp.employmentType;
        experience.still_working = exp.stillWorking;
        experience.start_date = exp.startDate;
        experience.end_date = exp.endDate;
        experience.custom_job_application_submit = customJobApplicationSubmit;
        experience.custom_job_application_submit_id =
            customJobApplicationSubmit.id;
        return await CustomJobApplicationExperienceRepository.save(experience);
    });
    const experiences = await Promise.all(experiencePromises);
    const newResume = new CustomJobApplicationResume();
    newResume.name = data.resume.name;
    newResume.size = data.resume.size;
    newResume.url = data.resume.url;
    newResume.custom_job_application_submit = customJobApplicationSubmit;
    newResume.custom_job_application_submit_id = customJobApplicationSubmit.id;
    const resume = await CustomJobApplicationResumeRepository.save(newResume);

    const answerPromises = data.answers.map(async (ans) => {
        const answer = await ApplicationAnswerModel.create({
            answer: ans.answer,
            questionId: ans.questionId,
            accountId: account.id,
            customJobApplicationSubmitId: customJobApplicationSubmit.id,
        });
        return answer;
    });
    const answers = await Promise.all(answerPromises);

    const customJobApplicationState = new CustomJobApplicationState();
    customJobApplicationState.custom_job_application_submit_id =
        customJobApplicationSubmit.id;
    customJobApplicationState.custom_job_application_submit =
        customJobApplicationSubmit;
    customJobApplicationState.state = JobApplicationStateEnum.PENDING;
    await CustomJobApplicationStatesRepository.save(customJobApplicationState);

    const accountArchivedJobApplication =
        new AccountArchivedCustomJobApplications();
    accountArchivedJobApplication.account = account;
    accountArchivedJobApplication.custom_job_application_submit_id =
        customJobApplicationSubmit.id;
    accountArchivedJobApplication.custom_job_application_submit =
        customJobApplicationSubmit;
    accountArchivedJobApplication.is_archived = false;
    await AccountArchivedCustomJobApplicationsRepository.save(
        accountArchivedJobApplication,
    );
};

export const uploadCustomJobApplicationResume = uploadSingleResume('resume');
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
                    const resumeDbUrl = `${process.env.BASE_URL}/uploads/customJobApplicationResumes/${resumeName}`;
                    // Save the PDF to disk
                    const filePath = `src/uploads/customJobApplicationResumes/${resumeName}`;

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

export const getAllCustomJobApplicationSubmitsService = async (
    req: Request,
) => {
    const accountId = Number(req.user.id);
    const customJobApplicationId = Number(req.params.customJobApplicationId);
    const customJobApplication = await CustomJobApplicationRepository.findOne({
        where: { id: customJobApplicationId },
        relations: ['job'],
    });
    if (!customJobApplication) {
        throw new AppError('job application not found', 404);
    }
    if (customJobApplication.job.status !== JobStatus.OPENED) {
        throw new AppError('jobs no longer accepts responses', 400);
    }
    const isAllowedToPostJob = await HrEmployeeRepository.checkPermission(
        accountId,
        customJobApplication.job.business_id,
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
        const paginateConfig: PaginateConfig<CustomJobApplicationSubmit> = {
            //searchableColumns: ['first_name', 'last_name', 'email'],
            sortableColumns: ['created_at'],
            //filterableColumns:{id:5},
            filterableColumns: {
                'custom_job_application_state.state': [FilterOperator.EQ],
            },

            relations: ['account', 'custom_job_application_state'],
            where: { custom_job_application: { id: customJobApplicationId } },
            defaultSortBy: [['created_at', 'ASC']],
            maxLimit: 20,
            defaultLimit: transformedQuery.limit,

            paginationType: PaginationType.TAKE_AND_SKIP,
        };
        const queryBuilder =
            CustomJobApplicationSubmitRepository.createQueryBuilder('cjas')
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
                    'cjas.custom_job_application_id',
                ])

                // LEFT JOIN Job
                .where('cjas.custom_job_application_id = :id', {
                    id: customJobApplicationId,
                });
        console.log(transformedQuery.search);
        if (transformedQuery.search) {
            queryBuilder.andWhere(
                `cjas.first_name || ' ' || cjas.last_name  ILIKE :searchQuery`,
                {
                    searchQuery: `%${transformedQuery.search}%`,
                },
            );
        }
        const customJobApplicationSubmits =
            await paginate<CustomJobApplicationSubmit>(
                transformedQuery,
                queryBuilder,
                paginateConfig,
            );
        customJobApplicationSubmits.data.map((csa) => {
            delete csa.account;
        });
        return customJobApplicationSubmits;
    } catch (err) {
        console.log(err);
        throw new AppError('Error in getting customJobApplicationSubmits', 400);
    }
};
