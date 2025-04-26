import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { AccountArchivedCustomJobApplications } from '../../entity/Job/customJobApplication/AccountArchivedCustomJobApplications';

class AccountArchivedCustomJobApplicationsRepositoryClass extends Repository<AccountArchivedCustomJobApplications> {}

export const AccountArchivedCustomJobApplicationsRepository =
    AppDataSource.getRepository(AccountArchivedCustomJobApplications).extend(
        AccountArchivedCustomJobApplicationsRepositoryClass.prototype,
    );
