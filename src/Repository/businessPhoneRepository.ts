import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { BusinessPhone } from '../entity/BusinessPhone';
import { CountryCode } from '../enums/countryCode';

class BusinessPhoneRepositoryClass extends Repository<BusinessPhone> {
    async checkIfPhoneNumberExists(
        country_code: CountryCode,
        phone_number: string,
    ) {
        const query = await this.query(
            `SELECT * from business_phone WHERE country_code = $1 AND phone_number = $2`,
            [country_code, phone_number],
        );
        return query.length > 0;
    }
}

export const BusinessPhoneRepository = AppDataSource.getRepository(
    BusinessPhone,
).extend(BusinessPhoneRepositoryClass.prototype);
