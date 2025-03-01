import { Repository } from 'typeorm';
import { AccountProject } from '../../entity/Account/AccountProject';
import { AppDataSource } from '../../data-source';

class AccountProjectRepositoryClass extends Repository<AccountProject> {}

export const AccountProjectRepository = AppDataSource.getRepository(
    AccountProject,
).extend(AccountProjectRepositoryClass.prototype);
