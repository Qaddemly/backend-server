import { Repository } from 'typeorm';
import { Language } from '../entity/Language';
import { AppDataSource } from '../data-source';

class LanguageRepositoryClass extends Repository<Language> {
    async deleteAllLanguages(accountId: number) {
        return this.createQueryBuilder('language')
            .delete()
            .where('account_id = :accountId', { accountId: accountId })
            .execute();
    }
}

export const LanguageRepository = AppDataSource.getRepository(Language).extend(
    LanguageRepositoryClass.prototype,
);
