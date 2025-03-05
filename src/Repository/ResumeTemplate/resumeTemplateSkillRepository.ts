import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { ResumeTemplateSkill } from '../../entity/ResumeTemplate/ResumeTemplateSkill';

class ResumeTemplateSkillRepositoryClass extends Repository<ResumeTemplateSkill> {}

export const ResumeTemplateSkillRepository = AppDataSource.getRepository(
    ResumeTemplateSkill,
).extend(ResumeTemplateSkillRepositoryClass.prototype);
