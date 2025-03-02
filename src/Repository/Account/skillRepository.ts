import { Repository } from 'typeorm';
import { AccountSkill } from '../../entity/Account/AccountSkill';
import { AppDataSource } from '../../data-source';
import { SkillType } from '../../types/types';
import AppError from '../../utils/appError';

class SkillRepositoryClass extends Repository<AccountSkill> {
    async createSkills(account_id: number, skills: string[]) {
        const result = await AppDataSource.createQueryBuilder()
            .insert()
            .into(AccountSkill)
            .values(
                skills.map((skill) => ({
                    account: { id: account_id },
                    name: skill,
                })),
            )
            .returning('*')
            .execute();
        return result.raw;
    }
    async deleteSkills(account_id: number, skillsId: number[]) {
        const foundedSkills = await SkillRepository.query(`
                    select * from account_skill where id in (${skillsId.map((skill) => `${skill}`).join(', ')}) and account_id=${account_id}  `);
        if (foundedSkills.length != skillsId.length) {
            throw new AppError('error while deleting skills', 400);
        }
        await SkillRepository.remove(foundedSkills);
    }
}

export const SkillRepository = AppDataSource.getRepository(AccountSkill).extend(
    SkillRepositoryClass.prototype,
);
