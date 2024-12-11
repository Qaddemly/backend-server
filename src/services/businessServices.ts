import { Business } from '../entity/Business';
import { CreateBusinessDto } from '../dtos/businessDto';
import { businessRepo } from '../Repository/businessRepo';
import { AccountRepo } from '../Repository/accountRepo';
import { HrEmployee } from '../entity/HrEmployee';
import { HrRole } from '../enums/HrRole';
import { HrEmployeeRepo } from '../Repository/hrEmployeeRepo';
import { Address } from '../entity/Address';
import AppError from '../utils/appError';

/**
 * TODO: mark the Account that created the business as the owner.
 * TODO: make it possible for user to add hr_employees with their roles at Creation.
 * */

export const createBusiness = async (
    createBusinessDto: CreateBusinessDto,
    accountId: number,
): Promise<Business> => {
    // Get the current authenticated user
    const account = await AccountRepo.findOneBy({ id: accountId });

    if (!account) {
        throw new AppError(
            `Account with ${accountId} do not exist in database`,
            500,
        );
    }

    const business = new Business();
    business.name = createBusinessDto.name;
    business.logo = createBusinessDto.logo;
    business.CEO = createBusinessDto.CEO;
    business.founder = createBusinessDto.founder;
    business.founded = createBusinessDto.founded;

    const address = new Address();
    address.country = createBusinessDto.address.country;
    address.city = createBusinessDto.address.city;
    business.address = address;

    business.location_type = createBusinessDto.location_type;
    business.description = createBusinessDto.description;
    business.company_size = createBusinessDto.company_size;
    business.industry = createBusinessDto.industry;
    business.website = createBusinessDto.website;
    business.headquarter = createBusinessDto.headquarter;
    business.email = createBusinessDto.email;
    business.phone = createBusinessDto.phone;

    // business.hr_employees = createBusinessDto.hr_employees;

    const hrEmployee = new HrEmployee();
    hrEmployee.business = business;
    hrEmployee.account = account;
    hrEmployee.role = HrRole.OWNER;

    const saved_business = await businessRepo.save(business);
    await HrEmployeeRepo.save(hrEmployee);

    return saved_business;
};
