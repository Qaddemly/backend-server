import { Repository } from 'typeorm';
import { Account } from '../entity/Account';
import { AppDataSource } from '../data-source';

class AccountRepositoryClass extends Repository<Account> {}

export const AccountRepository = AppDataSource.getRepository(Account).extend(
    AccountRepositoryClass.prototype,
);
