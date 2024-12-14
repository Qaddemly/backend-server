import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Job } from '../entity/Job';

class JobRepositoryClass extends Repository<Job> {
    async getSixJobsOfBusiness(businessId: number) {
        return await this.query(
            'SELECT j.description as job_description,' +
                ' j.id as job_id,' +
                ' j.title as job_title,' +
                ' j.location as job_location,' +
                ' j.location_type as job_location_type,' +
                ' j.skills as job_skills,' +
                ' j.salary as job_salary,' +
                ' j.employee_type as job_employee_type,' +
                ' j.keywords as job_keywords,' +
                ' j.experience as job_experience,' +
                ' j.created_at as job_create_at,' +
                ' b.id as business_id,' +
                ' b.name as business_name,' +
                ' b.logo as business_logo,' +
                ' b.industry as business_industry' +
                ' FROM job as j JOIN business as b ON j.business_id = $1 LIMIT 6',
            [businessId],
        );
    }

    async getAllJobsOfBusiness(businessId: number) {
        return this.query(
            'SELECT j.description as job_description,' +
                ' j.id as job_id,' +
                ' j.title as job_title,' +
                ' j.location as job_location,' +
                ' j.location_type as job_location_type,' +
                ' j.skills as job_skills,' +
                ' j.salary as job_salary,' +
                ' j.employee_type as job_employee_type,' +
                ' j.keywords as job_keywords,' +
                ' j.experience as job_experience,' +
                ' j.created_at as job_create_at,' +
                ' b.id as business_id,' +
                ' b.name as business_name,' +
                ' b.logo as business_logo,' +
                ' b.industry as business_industry' +
                ' FROM job as j JOIN business as b ON j.business_id = $1',
            [businessId],
        );
    }
}

export const JobRepository = AppDataSource.getRepository(Job).extend(
    JobRepositoryClass.prototype,
);
