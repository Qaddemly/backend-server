import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { JobApplicationState } from '../../entity/Job/JobApplication/JobApplicationStates';

class JobApplicationStatesRepositoryClass extends Repository<JobApplicationState> {}
export const JobApplicationStatesRepository = AppDataSource.getRepository(
    JobApplicationState,
).extend(JobApplicationStatesRepositoryClass.prototype);
