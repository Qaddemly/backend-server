import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { JobApplicationResume } from '../../entity/Job/JobApplication/JobApplicationResume';

class JobApplicationResumeRepositoryClass extends Repository<JobApplicationResume> {}
export const JobApplicationResumeRepository = AppDataSource.getRepository(
    JobApplicationResume,
).extend(JobApplicationResumeRepositoryClass.prototype);
