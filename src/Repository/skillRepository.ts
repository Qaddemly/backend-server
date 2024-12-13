import { Repository } from 'typeorm';
import { Skill } from '../entity/Skill';
import { AppDataSource } from '../data-source';

class SkillRepositoryClass extends Repository<Skill> {
    async deleteAllSkills(accountId: number) {
        return this.createQueryBuilder()
            .delete()
            .where('account_id = :accountId', { accountId: accountId })
            .execute();
    }
}

export const SkillRepository = AppDataSource.getRepository(Skill).extend(
    SkillRepositoryClass.prototype,
);
