import { Repository } from 'typeorm';
import { Education as EducationType } from '../types/types';
import { Education } from '../entity/Education';
import { AppDataSource } from '../data-source';

class EducationRepositoryClass extends Repository<Education> {
    async updateEducation(
        education: { [key: string]: any },
        accountId: number,
    ) {
        const result = await AppDataSource.createQueryBuilder()
            .update(Education)
            .set(education)
            .where('account_id = :accountId', { accountId })
            .returning('*')
            .execute();
        return result.raw[0];
    }
}

export const EducationRepository = AppDataSource.getRepository(
    Education,
).extend(EducationRepositoryClass.prototype);
