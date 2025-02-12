import { Repository } from 'typeorm';
import { Education as EducationType } from '../types/types';
import { Education } from '../entity/Education';
import { AppDataSource } from '../data-source';
import { insertValuesInToOneToManyRelationsWithAccount } from './commons';

class EducationRepositoryClass extends Repository<Education> {
    async updateEducation(
        educationId: number,
        education: { [key: string]: any },
        accountId: number,
    ) {
        const result = await AppDataSource.createQueryBuilder()
            .update(Education)
            .set(education)
            .where('account_id = :accountId', { accountId })
            .andWhere('id = :educationId', { educationId })
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
    async createOneEducation(
        account_id: number,
        education: EducationType | any,
    ) {
        return await this.query(`insert into education(account_id,university,
    field_of_study,
    gpa,
    start_date,
    end_date) values (${account_id},'${education.university}','${education.field_of_study}',${education.gpa},'${education.start_date}','${education.end_date}') returning *`);
    }
}

export const EducationRepository = AppDataSource.getRepository(
    Education,
).extend(EducationRepositoryClass.prototype);
