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

    async getFiveReviewsOfBusiness(businessId: number): Promise<Business[]> {
        return await this.query(
            'SELECT a.first_name, a.last_name, a.profile_picture, r.description, r.rating, r.business_id, r.account_id, r.created_at, r.updated_at FROM review AS r JOIN business AS b ON r.business_id = $1 JOIN account AS a ON r.account_id = a.id LIMIT 5',
            [businessId],
        );
    }
}

export const BusinessRepository = AppDataSource.getRepository(Business).extend(
    BusinessRepositoryClass.prototype,
);
