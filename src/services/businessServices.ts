import { Business } from '../entity/Business';
import { CreateBusinessDto, UpdateBusinessDTO } from '../dtos/businessDto';
import { BusinessRepository } from '../Repository/businessRepository';
import { AccountRepository } from '../Repository/accountRepository';
import { HrEmployee } from '../entity/HrEmployee';
import { HrRole } from '../enums/HrRole';
import { Address } from '../entity/Address';
import AppError from '../utils/appError';
import { HrEmployeeRepository } from '../Repository/hrEmployeeRepository';
import { Logger } from '../utils/logger';
import { ReviewRepository } from '../Repository/reviewRepository';
/**
 * TODO: mark the Account that created the business as the owner.
 * TODO: make it possible for user to add hr_employees with their roles at Creation.
 * */

export const createBusiness = async (
    createBusinessDto: CreateBusinessDto,
    accountId: number,
): Promise<Business> => {
    // Get the current authenticated user
    const account = await AccountRepository.findOneBy({ id: accountId });

    if (!account) {
        Logger.error('Account with ${accountId} do not exist in database');
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
    Logger.info(`Business ${saved_business.id} created successfully`);
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
        Logger.error('User does not have permission to update business');
        throw new AppError(
            'User does not have permission to update business',
            403,
        );
    }
    const business = await BusinessRepository.updateBusiness(
        updateBusinessDTO,
        businessId,
    );
    Logger.info(`Business ${businessId} updated successfully`);
    return business;
};

export const getUserBusinesses = async (accountId: number) => {
    return await BusinessRepository.getBusinessOfAccount(accountId);
};

export const getBusinessById = async (businessId: number) => {
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        Logger.error('Business not found');
        throw new AppError('Business not found', 404);
    }
    return business;
};
export const getFiveReviewsOfBusiness = async (businessId: number) => {
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        Logger.error('Business not found');
        throw new AppError('Business not found', 404);
    }
    return await ReviewRepository.getFiveReviewsOfBusiness(businessId);
};
export const getSixJobsOfBusiness = async (businessId: number) => {
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        Logger.error('Business not found');
        throw new AppError('Business not found', 404);
    }
    return await BusinessRepository.getSixJobsOfBusiness(businessId);
};
export const getAllReviewsOfBusiness = async (businessId: number) => {
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        Logger.error('Business not found');
        throw new AppError('Business not found', 404);
    }
    return await ReviewRepository.getAllReviewsOfBusiness(businessId);
};
