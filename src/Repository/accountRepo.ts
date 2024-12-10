import { Repository } from 'typeorm';
import { Account } from '../entity/Account';
import { AppDataSource } from '../data-source';

export const AccountRepo: Repository<Account> =
    AppDataSource.getRepository(Account);
