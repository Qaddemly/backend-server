import { Repository } from 'typeorm';
import { Business } from '../entity/Business';
import { AppDataSource } from '../data-source';
import { UpdateBusinessDTO } from '../dtos/businessDto';

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
}

export const BusinessRepository = AppDataSource.getRepository(Business).extend(
    BusinessRepositoryClass.prototype,
);
