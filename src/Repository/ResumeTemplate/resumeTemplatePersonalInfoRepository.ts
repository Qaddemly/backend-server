import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { ResumeTemplatePersonalInfo } from '../../entity/ResumeTemplate/ResumeTemplatePersonalInfo';
import { CreatePersonalInfoContentBody } from '../../dtos/resumeTemplate/resumeTemplatePersonalInfoDto';

class ResumeTemplatePersonalInfoRepositoryClass extends Repository<ResumeTemplatePersonalInfo> {
    async createOne(data: CreatePersonalInfoContentBody) {
        const result = await this.createQueryBuilder()
            .insert()
            .into(ResumeTemplatePersonalInfo)
            .values(data)
            .returning('*')
            .execute();
        return result.raw[0];
    }
}

export const ResumeTemplatePersonalInfoRepository = AppDataSource.getRepository(
    ResumeTemplatePersonalInfo,
).extend(ResumeTemplatePersonalInfoRepositoryClass.prototype);
