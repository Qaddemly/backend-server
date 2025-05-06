import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { JobApplicationForm } from '../../entity/Job/JobApplication/JobApplicationForm';

class JobApplicationRepositoryClass extends Repository<JobApplicationForm> {}
export const JobApplicationFormRepository = AppDataSource.getRepository(
    JobApplicationForm,
).extend(JobApplicationRepositoryClass.prototype);
