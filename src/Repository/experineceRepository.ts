import { Repository } from 'typeorm';
import { Experience } from '../entity/Experience';
import { AppDataSource } from '../data-source';
import { updateExperienceData } from '../types/documentTypes';

class ExperienceRepositoryClass extends Repository<Experience> {
    async deleteAllExperience(accountId: number) {
        return this.createQueryBuilder('experienceId')
            .delete()
            .where('account_id = :accountId', { accountId: accountId })
            .execute();
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
