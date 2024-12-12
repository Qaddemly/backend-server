import { Business } from '../entity/Business';
import { CreateBusinessDto, UpdateBusinessDTO } from '../dtos/businessDto';
import { BusinessRepository } from '../Repository/businessRepo';
import { AccountRepository } from '../Repository/accountRepository';
import { HrEmployee } from '../entity/HrEmployee';
import { HrRole } from '../enums/HrRole';
import { Address } from '../entity/Address';
import AppError from '../utils/appError';
import { container, Logging } from '../utils/logger';
import { HrEmployeeRepository } from '../Repository/hrEmployeeRepo';

/**
 * TODO: mark the Account that created the business as the owner.
 * TODO: make it possible for user to add hr_employees with their roles at Creation.
 * */

const logger = container.get(Logging);

export const createBusiness = async (
    createBusinessDto: CreateBusinessDto,
    accountId: number,
): Promise<Business> => {
    // Get the current authenticated user
    const account = await AccountRepository.findOneBy({ id: accountId });

    if (!account) {
        logger.logError('Account with ${accountId} do not exist in database');
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

    const saved_business = await BusinessRepository.save(business);
    await HrEmployeeRepository.save(hrEmployee);

    return saved_business;
};

export const updateBusiness = async (
    updateBusinessDTO: UpdateBusinessDTO,
    accountId: number,
    businessId: number,
) => {
    const account = await AccountRepository.findOneBy({ id: accountId });
    // We need to get all business that user has role in
    const permissionToUpdate = await HrEmployeeRepository.checkPermission(
        accountId,
        businessId,
    );

    if (!permissionToUpdate) {
        logger.logError('User does not have permission to update business');
        throw new AppError(
            'User does not have permission to update business',
            403,
        );
    }
    return await BusinessRepository.updateBusiness(
        updateBusinessDTO,
        businessId,
    );
};
