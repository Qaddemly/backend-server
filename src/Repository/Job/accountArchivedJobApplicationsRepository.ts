import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { AccountArchivedJobApplications } from '../../entity/Job/JobApplication/AccountArchivedJobApplications';

class AccountArchivedJobApplicationsRepositoryClass extends Repository<AccountArchivedJobApplications> {}

export const AccountArchivedJobApplicationsRepository =
    AppDataSource.getRepository(AccountArchivedJobApplications).extend(
        AccountArchivedJobApplicationsRepositoryClass.prototype,
    );
