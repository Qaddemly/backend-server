import { Repository } from 'typeorm';
import { Experience } from '../entity/Experience';
import { Experience as ExperienceType } from '../types/types';
import { AppDataSource } from '../data-source';
import { updateExperienceData } from '../types/documentTypes';
import { insertValuesInToOneToManyRelationsWithAccount } from './commons';

class ExperienceRepositoryClass extends Repository<Experience> {
    async createExperiences(account_id: number, experiences: ExperienceType[]) {
        return await insertValuesInToOneToManyRelationsWithAccount(
            account_id,
            Experience,
            experiences,
        );
    }
    async updateOneExperience(
        experienceId: number,
        accountId: number,
        updateData: updateExperienceData,
    ) {
        const experience = await this.createQueryBuilder('experience')
            .update(Experience)
            .set(updateData)
            .where('id = :experienceId', { experienceId: experienceId })
            .andWhere('account.id = :accountId', { accountId: accountId })
            .returning('*')
            .execute();
        return experience.raw[0];
    }
}

export const ExperienceRepository = AppDataSource.getRepository(
    Experience,
).extend(ExperienceRepositoryClass.prototype);
