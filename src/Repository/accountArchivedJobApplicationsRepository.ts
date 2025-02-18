import { AccountArchivedJobApplications } from '../entity/AccountArchivedJobApplications';
import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';

class AccountArchivedJobApplicationsRepositoryClass extends Repository<AccountArchivedJobApplications> {}

export const AccountArchivedJobApplicationsRepository =
    AppDataSource.getRepository(AccountArchivedJobApplications).extend(
        AccountArchivedJobApplicationsRepositoryClass.prototype,
    );
