import { Repository } from 'typeorm';
import { JobApplicationState } from '../entity/JobApplicationStates';
import { AppDataSource } from '../data-source';

class JobApplicationStatesRepositoryClass extends Repository<JobApplicationState> {}
export const JobApplicationStatesRepository = AppDataSource.getRepository(
    JobApplicationState,
).extend(JobApplicationStatesRepositoryClass.prototype);
