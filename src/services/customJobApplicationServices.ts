import { CreateCustomJobApplicationDto } from '../dtos/customJobApplicationDto';
import { CustomJobApplication } from '../entity/Job/customJobApplication';
import { HrRole } from '../enums/HrRole';
import { ApplicationQuestionModel } from '../models/customJobApplicationQuestion';
import { BusinessRepository } from '../Repository/Business/businessRepository';
import { HrEmployeeRepository } from '../Repository/Business/hrEmployeeRepository';
import { CustomJobApplicationRepository } from '../Repository/Job/customJobApplicationRepository';
import { JobRepository } from '../Repository/Job/jobRepository';
import AppError from '../utils/appError';

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
    newCustomJobApplication.business = job.business;
    newCustomJobApplication.job_id = jobId;
    newCustomJobApplication.business_id = job.business.id;
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
        business_id: job.business.id,
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
