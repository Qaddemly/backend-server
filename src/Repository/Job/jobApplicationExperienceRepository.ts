import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { JobApplicationExperience } from '../../entity/Job/JobApplication/JobApplicationExperience';

class JobApplicationExperienceRepositoryClass extends Repository<JobApplicationExperience> {}
export const JobApplicationExperienceRepository = AppDataSource.getRepository(
    JobApplicationExperience,
).extend(JobApplicationExperienceRepositoryClass.prototype);
