import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { BusinessPhone } from '../entity/BusinessPhone';

class BusinessPhoneRepositoryClass extends Repository<BusinessPhone> {}

export const BusinessPhoneRepository = AppDataSource.getRepository(
    BusinessPhone,
).extend(BusinessPhoneRepositoryClass.prototype);
