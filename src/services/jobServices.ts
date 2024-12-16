import { Request } from 'express';
import { CreateJobBodyBTO } from '../dtos/jobDto';
import { BusinessRepository } from '../Repository/businessRepository';
import AppError from '../utils/appError';
import { Job } from '../entity/Job';
import { JobRepository } from '../Repository/jobRepository';
import { HrEmployeeRepository } from '../Repository/hrEmployeeRepository';
import { HrRole } from '../enums/HrRole';

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
        throw new AppError('you do not have permission to post job', 403);
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
        business_id,
    } = req.body;
    const userId = Number(req.user.id);
    const jobId = Number(req.params.id);
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
