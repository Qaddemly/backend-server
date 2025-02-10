import { Repository } from 'typeorm';
import { Language } from '../entity/Language';
import { AppDataSource } from '../data-source';
import { languageType } from '../types/types';
import { insertValuesInToOneToManyRelationsWithAccount } from './commons';
import { Language as Lang } from '../enums/language';
import AppError from '../utils/appError';

class LanguageRepositoryClass extends Repository<Language> {
    async createLanguages(account_id: number, languages: Lang[]) {
        const result = await AppDataSource.createQueryBuilder()
            .insert()
            .into(Language)
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
                select * from language where id in (${languagesId.map((lang) => `${lang}`).join(', ')}) and account_id=${account_id}  `);
        if (foundedLanguages.length != languagesId.length) {
            throw new AppError('error while deleting languages', 400);
        }
        await LanguageRepository.remove(foundedLanguages);
    }
}

export const LanguageRepository = AppDataSource.getRepository(Language).extend(
    LanguageRepositoryClass.prototype,
);
