import { Repository } from 'typeorm';
import { Education as EducationType } from '../../types/types';
import { AccountEducation } from '../../entity/Account/AccountEducation';
import { AppDataSource } from '../../data-source';
import { insertValuesInToOneToManyRelationsWithAccount } from '../General/commons';

class EducationRepositoryClass extends Repository<AccountEducation> {
    async updateEducation(
        educationId: number,
        education: { [key: string]: any },
        accountId: number,
    ) {
        const result = await AppDataSource.createQueryBuilder()
            .update(AccountEducation)
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
            AccountEducation,
            educations,
        );
    }
    async createOneEducation(
        account_id: number,
        education: EducationType | any,
    ) {
        return await this
            .query(`insert into account_education(account_id,university,
    field_of_study,
    gpa,
    start_date,
    end_date) values (${account_id},'${education.university}','${education.field_of_study}',${education.gpa},'${education.start_date}','${education.end_date}') returning *`);
    }
}

export const EducationRepository = AppDataSource.getRepository(
    AccountEducation,
).extend(EducationRepositoryClass.prototype);
