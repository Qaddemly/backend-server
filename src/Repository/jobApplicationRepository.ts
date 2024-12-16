import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { JobApplication } from '../entity/JobApplication';

class JobApplicationRepositoryClass extends Repository<JobApplication> {}

export const JobApplicationRepository = AppDataSource.getRepository(
    JobApplication,
).extend(JobApplicationRepositoryClass.prototype);
