import { Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { AccountVolunteering } from '../../entity/Account/AccountVolunteering';

class AccountVolunteeringRepositoryClass extends Repository<AccountVolunteering> {}

export const AccountVolunteeringRepository = AppDataSource.getRepository(
    AccountVolunteering,
).extend(AccountVolunteeringRepositoryClass.prototype);
