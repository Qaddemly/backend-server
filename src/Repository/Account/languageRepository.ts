import { Repository } from 'typeorm';
import { AccountLanguage } from '../../entity/Account/AccountLanguage';
import { AppDataSource } from '../../data-source';
import { languageType } from '../../types/types';
import { insertValuesInToOneToManyRelationsWithAccount } from '../General/commons';
import { Language as Lang } from '../../enums/language';
import AppError from '../../utils/appError';

class LanguageRepositoryClass extends Repository<AccountLanguage> {
    async createLanguages(account_id: number, languages: Lang[]) {
        const result = await AppDataSource.createQueryBuilder()
            .insert()
            .into(AccountLanguage)
            .values(
                languages.map((lang) => ({
                    account: { id: account_id },
                    name: lang,
                })),
            )
            .returning('*')
            .execute();
        return result.raw;
    }

    async deleteLanguages(account_id: number, languagesId: number[]) {
        const foundedLanguages = await LanguageRepository.query(`
                select * from account_language where id in (${languagesId.map((lang) => `${lang}`).join(', ')}) and account_id=${account_id}  `);
        if (foundedLanguages.length != languagesId.length) {
            throw new AppError('error while deleting languages', 400);
        }
        await LanguageRepository.remove(foundedLanguages);
    }
}

export const LanguageRepository = AppDataSource.getRepository(
    AccountLanguage,
).extend(LanguageRepositoryClass.prototype);
