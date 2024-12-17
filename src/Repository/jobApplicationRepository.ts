import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { JobApplication } from '../entity/JobApplication';

class JobApplicationRepositoryClass extends Repository<JobApplication> {
    async findAllApplicationsByJobId(jobId: number) {
        const jobApplications = await this.find({
            where: { job: { id: jobId } },
            relations: ['job', 'resume', 'resume.account'],
        });
        return jobApplications;
    }
}

export const JobApplicationRepository = AppDataSource.getRepository(
    JobApplication,
).extend(JobApplicationRepositoryClass.prototype);
