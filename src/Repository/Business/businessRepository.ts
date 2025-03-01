import { Repository } from 'typeorm';
import { Business } from '../../entity/Business/Business';
import { AppDataSource } from '../../data-source';
import { UpdateBusinessDTO } from '../../dtos/businessDto';
import { HrEmployee } from '../../entity/Business/HrEmployee';
import { Review } from '../../entity/General/Review';

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
}

export const BusinessRepository = AppDataSource.getRepository(Business).extend(
    BusinessRepositoryClass.prototype,
);
