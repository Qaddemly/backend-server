import { Repository } from 'typeorm';
import { Experience } from '../entity/Experience';
import { AppDataSource } from '../data-source';

class ExperienceRepositoryClass extends Repository<Experience> {
    async deleteAllExperience(accountId: number) {
        return this.createQueryBuilder('experienceId')
            .delete()
            .where('account_id = :accountId', { accountId: accountId })
            .execute();
    }
}

export const ExperienceRepository = AppDataSource.getRepository(
    Experience,
).extend(ExperienceRepositoryClass.prototype);
