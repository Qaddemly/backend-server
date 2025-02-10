import { Repository } from 'typeorm';
import { Education as EducationType } from '../types/types';
import { Education } from '../entity/Education';
import { AppDataSource } from '../data-source';
import { insertValuesInToOneToManyRelationsWithAccount } from './commons';

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
    async createEductions(account_id: number, educations: EducationType[]) {
        return await insertValuesInToOneToManyRelationsWithAccount(
            account_id,
            Education,
            educations,
        );
    }
}

export const EducationRepository = AppDataSource.getRepository(
    Education,
).extend(EducationRepositoryClass.prototype);
