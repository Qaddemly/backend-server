import { Repository } from 'typeorm';
import { AccountExperience } from '../../entity/Account/AccountExperience';
import { Experience as ExperienceType } from '../../types/types';
import { AppDataSource } from '../../data-source';
import { updateExperienceData } from '../../types/documentTypes';
import { insertValuesInToOneToManyRelationsWithAccount } from '../General/commons';

class ExperienceRepositoryClass extends Repository<AccountExperience> {
    async createExperiences(account_id: number, experiences: ExperienceType[]) {
        return await insertValuesInToOneToManyRelationsWithAccount(
            account_id,
            AccountExperience,
            experiences,
        );
    }
    async updateOneExperience(
        experienceId: number,
        accountId: number,
        updateData: updateExperienceData,
    ) {
        const experience = await this.createQueryBuilder('experience')
            .update(AccountExperience)
            .set(updateData)
            .where('id = :experienceId', { experienceId: experienceId })
            .andWhere('account.id = :accountId', { accountId: accountId })
            .returning('*')
            .execute();
        return experience.raw[0];
    }
}

export const ExperienceRepository = AppDataSource.getRepository(
    AccountExperience,
).extend(ExperienceRepositoryClass.prototype);
