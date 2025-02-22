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
            `select *
             from job_application
                      join account_archived_job_applications
                           on job_application.id = account_archived_job_applications.job_application_id
                               AND job_application.account_id = ${accountId}
                               AND account_archived_job_applications.is_archived = true`,
        );
    }
    async getOneJobApplication(jobApplicationId: number) {
        const jobApplication = await this.createQueryBuilder('ja')
            .select([
                'ja.id',
                'ja.jop_application_state',
                'ja.created_at',
                'ja.updated_at',
                // Account fields
                'a.id',
                'a.address.country',
                'a.address.city',
                'a.phone.number',
                'a.phone.country_code',
                'a.first_name',
                'a.last_name',
                'a.email',
                'a.profile_picture',
                'a.about_me',
                'a.date_of_birth',
                'a.country',
                'a.country_code',
                'a.city',
                'a.number',
                'a.subtitle',
                // Job fields
                'j',
                // Resume fields
                'resume',
                // Education fields
                'edu',
                // Skills fields
                'skill.name',
                // Certificates fields
                'cert',
                // Projects fields
                'proj',
                'bus.id',
            ])
            .leftJoin('ja.account', 'a') // LEFT JOIN Account
            .leftJoin('ja.job', 'j') // LEFT JOIN Job
            .leftJoin('ja.resume', 'resume') // LEFT JOIN Resume
            // Join related entities inside Account
            .leftJoin('a.educations', 'edu') // Education
            .leftJoin('a.skills', 'skill') // Skills
            .leftJoin('a.certificates', 'cert') // Certificates
            .leftJoin('a.projects', 'proj') // Projects
            .leftJoin('j.business', 'bus') // Business
            .where('ja.id = :id', { id: jobApplicationId })
            .getOne();
        return jobApplication;
    }
}

export const JobApplicationRepository = AppDataSource.getRepository(
    JobApplication,
).extend(JobApplicationRepositoryClass.prototype);
