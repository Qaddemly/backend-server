import { Business } from '../entity/Business';
import {
    CreateBusinessDto,
    getBusinessDto,
    UpdateBusinessDTO,
} from '../dtos/businessDto';
import { BusinessRepository } from '../Repository/businessRepository';
import { AccountRepository } from '../Repository/accountRepository';
import { HrEmployee } from '../entity/HrEmployee';
import { HrRole } from '../enums/HrRole';
import { Address } from '../entity/Address';
import AppError from '../utils/appError';
import { HrEmployeeRepository } from '../Repository/hrEmployeeRepository';
import { Logger } from '../utils/logger';
import { ReviewRepository } from '../Repository/reviewRepository';
import { JobRepository } from '../Repository/jobRepository';
import { FollowBusinessRepository } from '../Repository/followBusinessRepository';
/**
 * TODO: mark the Account that created the business as the owner.
 * TODO: make it possible for user to add hr_employees with their roles at Creation.
 * */

export const createBusiness = async (
    createBusinessDto: CreateBusinessDto,
    accountId: number,
) => {
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
    return getBusinessDto(saved_business);
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
    return getBusinessDto(business);
};

export const getBusinessesThatUserHasRoleIn = async (accountId: number) => {
    return await BusinessRepository.getBusinessOfAccount(accountId);
};

export const getBusinessById = async (businessId: number) => {
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        Logger.error('Business not found');
        throw new AppError('Business not found', 404);
    }
    return getBusinessDto(business);
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
    return await JobRepository.getSixJobsOfBusiness(businessId);
};
export const getAllReviewsOfBusiness = async (businessId: number) => {
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        Logger.error('Business not found');
        throw new AppError('Business not found', 404);
    }
    return await ReviewRepository.getAllReviewsOfBusiness(businessId);
};
export const getAllJobsOfBusiness = async (businessId: number) => {
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        Logger.error('Business not found');
        throw new AppError('Business not found', 404);
    }
    return await JobRepository.getAllJobsOfBusiness(businessId);
};
export const addHrToBusiness = async (
    userId: number,
    businessId: number,
    accountEmail: string,
    role: HrRole,
) => {
    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        Logger.error('Business not found');
        throw new AppError('Business not found', 404);
    }
    const checkIfUserHasRole = await HrEmployeeRepository.checkPermission(
        userId,
        businessId,
    );
    if (!checkIfUserHasRole) {
        Logger.error('User does not have permission to add hr to business');
        throw new AppError(
            'User does not have permission to add hr to business',
            403,
        );
    }

    const account = await AccountRepository.findOneBy({ email: accountEmail });
    if (!account) {
        Logger.error('Account not found');
        throw new AppError('Account not found', 404);
    }

    // Check if user already has role in business
    const checkIfAccountHasRole =
        await HrEmployeeRepository.checkIfUserHasRoleInBusiness(
            account.id,
            businessId,
        );

    if (checkIfAccountHasRole) {
        Logger.error('User already has role in business');
        throw new AppError('User already has role in business', 400);
    }

    const hrEmployee = new HrEmployee();
    hrEmployee.business = business;
    hrEmployee.account = account;
    hrEmployee.role = role;
    return await HrEmployeeRepository.save(hrEmployee);
};

export const getFollowersNumberOfBusiness = async (businessId: number) => {
    return await FollowBusinessRepository.getFollowersNumberOfBusiness(
        businessId,
    );
};

export const getFollowersOfBusiness = async (businessId: number) => {
    return await FollowBusinessRepository.getFollowersOfBusiness(businessId);
};
