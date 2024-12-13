import { Repository } from 'typeorm';
import { Business } from '../entity/Business';
import { AppDataSource } from '../data-source';
import { UpdateBusinessDTO } from '../dtos/businessDto';
import { HrEmployee } from '../entity/HrEmployee';
import { Review } from '../entity/Review';

class BusinessRepositoryClass extends Repository<Business> {
    async updateBusiness(
        payload: UpdateBusinessDTO,
        businessId: number,
    ): Promise<Business> {
        const query = await this.createQueryBuilder('business')
            .update<Business>(Business)
            .set(payload)
            .where('id = :id', { id: businessId })
            .returning('*')
            .execute();

        return query.raw[0];
    }

    async getBusinessOfAccount(accountId: number): Promise<Business[]> {
        return await this.query(
            'SELECT b.id, b.name, b.logo, hr.role FROM business AS b JOIN hr_employee AS hr ON b.id = hr.business_id WHERE hr.account_id = $1',
            [accountId],
        );
    }

    async getFiveReviewsOfBusiness(businessId: number) {
        return await this.query(
            'SELECT a.id as account_id, ' +
                ' a.first_name as account_first_name,' +
                ' a.last_name as account_last_name,' +
                ' a.profile_picture as account_profile_picture,' +
                ' r.description as description,' +
                ' r.rating as review_rating,' +
                ' r.business_id as review_business_id,' +
                ' r.account_id as review_account_id,' +
                ' r.created_at as review_created_at,' +
                ' r.updated_at as review_updated_at ' +
                'FROM review AS r JOIN business AS b ON r.business_id = $1 JOIN account AS a ON r.account_id = a.id LIMIT 5',
            [businessId],
        );
    }

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
}

export const BusinessRepository = AppDataSource.getRepository(Business).extend(
    BusinessRepositoryClass.prototype,
);
