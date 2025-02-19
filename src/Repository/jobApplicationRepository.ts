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
    async findOneByAccountIdAndJobId(accountId: number, jobId: number) {
        const result = await this.query(
            `select * from job_application where account_id=${accountId} and job_id=${jobId} `,
        );
        return result[0];
    }
    async createJobApplication(
        accountId: number,
        jobId: number,
        resumeId?: number,
    ) {
        resumeId = resumeId ? resumeId : null;
        const result = await this.query(
            `insert into job_application (job_id,account_id,resume_id) values (${jobId},${accountId},${resumeId}) returning *`,
        );
        return result[0];
    }

    async getAllArchivedApplications(accountId: number) {
        return await this.query(
            `select * from job_application join account_archived_job_applications
                on job_application.id = account_archived_job_applications.job_application_id
                AND job_application.account_id = ${accountId}
                AND account_archived_job_applications.is_archived = true`,
        );
    }
}

export const JobApplicationRepository = AppDataSource.getRepository(
    JobApplication,
).extend(JobApplicationRepositoryClass.prototype);
