import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Job } from '../../entity/Job/Job';
import { updateJobQueryData } from '../../dtos/jobDto';

class JobRepositoryClass extends Repository<Job> {
    async getSixJobsOfBusiness(businessId: number) {
        return this
            .query(`SELECT j.description as job_description,j.id as job_id,
                        j.title as job_title,
                        j.location as job_location,
                        j.location_type as job_location_type,
                        j.skills as job_skills,
                        j.salary as job_salary,
                        j.employee_type as job_employee_type,
                        j.keywords as job_keywords,
                        j.experience as job_experience,
                        j.created_at as job_create_at,
                        b.id as business_id,
                        b.name as business_name,
                        b.logo as business_logo,
                        b.industry as business_industry
                        FROM job as j JOIN business as b ON (j.business_id = b.id AND b.id = ${businessId}) LIMIT 6`);
    }

    async getAllJobsOfBusiness(businessId: number) {
        return this
            .query(`SELECT j.description as job_description,j.id as job_id,
                        j.title as job_title,
                        j.location as job_location,
                        j.location_type as job_location_type,
                        j.skills as job_skills,
                        j.salary as job_salary,
                        j.employee_type as job_employee_type,
                        j.keywords as job_keywords,
                        j.experience as job_experience,
                        j.created_at as job_create_at,
                        b.id as business_id,
                        b.name as business_name,
                        b.logo as business_logo,
                        b.industry as business_industry
                        FROM job as j JOIN business as b ON (j.business_id = b.id AND b.id = ${businessId})`);
    }
    async findJobDetails(jobId: number) {
        const job = await this.createQueryBuilder('job')
            .leftJoinAndSelect('job.business', 'business') // Join with the Business table
            .where('job.id = :jobId', { jobId }) // Filter for a specific Job ID

            .getOne();
        return {
            ...job,
        };
    }

    async updateOneJob(jonId: number, updateData: updateJobQueryData) {
        const job = await this.createQueryBuilder('job')
            .update(Job)
            .set(updateData)
            .where('id = :jonId', { jonId: jonId })
            .returning('*')
            .execute();
        return job.raw[0];
    }
    async getJobWithBusiness(jobId: number) {
        const job = await this.findOne({
            where: { id: jobId },
            relations: ['business'],
            // Load current business
        });
        return job;
    }
}

export const JobRepository = AppDataSource.getRepository(Job).extend(
    JobRepositoryClass.prototype,
);
