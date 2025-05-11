import { Repository } from 'typeorm';

import { AppDataSource } from '../../data-source';
import { JobApplicationEducation } from '../../entity/Job/JobApplication/JobApplicationEducation';

class JobApplicationEducationRepositoryClass extends Repository<JobApplicationEducation> {}
export const JobApplicationEducationRepository = AppDataSource.getRepository(
    JobApplicationEducation,
).extend(JobApplicationEducationRepositoryClass.prototype);
