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
import { BusinessPhone } from '../entity/BusinessPhone';
import { BusinessPhoneRepository } from '../Repository/businessPhoneRepository';
import exp from 'node:constants';

/**
 * TODO: mark the Account that created the business as the owner.
 * TODO: make it possible for user to add hr_employees with their roles at Creation.
 * */

export const createBusiness = async (
    createBusinessDto: CreateBusinessDto,
    accountId: number,
) => {
    console.log(createBusinessDto);
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

    const saved_business = await BusinessRepository.save(business);

    // Add the account that created the business as the owner
    const hrEmployee = new HrEmployee();
    hrEmployee.business = business;
    hrEmployee.account = account;
    hrEmployee.role = HrRole.OWNER;
    await HrEmployeeRepository.save(hrEmployee);

    // Add the phones to the business
    for (let inputPhone of createBusinessDto.phones) {
        const phone = new BusinessPhone();
        phone.business = business;
        phone.country_code = inputPhone.country_code;
        phone.number = inputPhone.number;
        await BusinessPhoneRepository.save(phone);
    }

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
        [HrRole.OWNER, HrRole.SUPER_ADMIN],
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

    console.log(checkIfAccountHasRole);
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

export const updateHrRole = async (
    businessId: number,
    accountId: number,
    role: HrRole,
) => {
    const updatedHrEmployee = await HrEmployeeRepository.updateRole(
        accountId,
        businessId,
        role,
    );

    if (!updatedHrEmployee) {
        Logger.error(
            'Error while updating role, Email address of account do not exists in the HR list of company',
        );
        throw new AppError('Error while updating role', 400);
    }
    return true;
};
export const deleteHr = async (businessId: number, accountId: number) => {
    const deletedHrEmployee = await HrEmployeeRepository.deleteRole(
        accountId,
        businessId,
    );
    if (!deletedHrEmployee) {
        Logger.error(
            'Error while deleting role, Email address of account do not exists in the HR list of company',
        );
        throw new AppError('Error while deleting role', 400);
    }
    return true;
};
export const getAllHrOfBusiness = async (businessId: number) => {
    return await HrEmployeeRepository.getAllHrOfBusiness(businessId);
};

export const getFollowersNumberOfBusiness = async (businessId: number) => {
    return await FollowBusinessRepository.getFollowersNumberOfBusiness(
        businessId,
    );
};

export const getFollowersOfBusiness = async (businessId: number) => {
    return await FollowBusinessRepository.getFollowersOfBusiness(businessId);
};

export const checkBusinessDashboardAuthority = async (
    userId: number,
    businessId: number,
) => {
    const role = await HrEmployeeRepository.getRole(userId, businessId);
    console.log(role);
    if (role !== HrRole.OWNER && role !== HrRole.SUPER_ADMIN) {
        Logger.error(
            'User does not have permission to access business dashboard',
        );
        throw new AppError(
            'User does not have permission to access business dashboard',
            403,
        );
    }
    return role;
};
export const checkUpdateSuperAdminAuthority = async (
    userRole: HrRole,
    role: HrRole,
) => {
    if (role === HrRole.OWNER && userRole === HrRole.OWNER) {
        Logger.error(
            'Business can only have one owner, cannot be updated to owner',
        );
        throw new AppError(
            'Business can only have one owner, cannot be updated to owner',
            403,
        );
    } else if (role === HrRole.OWNER) {
        Logger.error(
            'User dont have authority to update owner, cannot be updated',
        );
        throw new AppError(
            'User dont have authority to update owner, cannot be updated',
            403,
        );
    }

    if (role === HrRole.SUPER_ADMIN && userRole !== HrRole.OWNER) {
        Logger.error(
            'User dont have authority to update super admin, cannot be updated',
        );
        throw new AppError(
            'User dont have authority to update super admin, cannot be updated',
            403,
        );
    }
};

export const checkAddNewHrAuthority = async (
    userRole: HrRole,
    role: HrRole,
) => {
    if (role === HrRole.OWNER && userRole === HrRole.OWNER) {
        Logger.error('Business can only have one owner');
        throw new AppError('Business can only have one owner', 403);
    } else if (role === HrRole.OWNER) {
        Logger.error('User dont have authority to add owner, cannot be added');
        throw new AppError(
            'User dont have authority to add owner, cannot be added',
            403,
        );
    }
    if (role === HrRole.SUPER_ADMIN && userRole !== HrRole.OWNER) {
        Logger.error(
            'User dont have authority to added super admin, cannot be added',
        );
        throw new AppError(
            'User dont have authority to added super admin, cannot be added',
            403,
        );
    }
};

export const checkDeleteHrAuthority = async (
    userRole: HrRole,
    accountId: number,
    businessId: number,
) => {
    const hrEmployeeRole = await HrEmployeeRepository.getRole(
        accountId,
        businessId,
    );
    if (!hrEmployeeRole) {
        Logger.error('User does not have role in business');
        throw new AppError('User does not have role in business', 403);
    }
    if (hrEmployeeRole === HrRole.OWNER) {
        Logger.error('Owner cannot be deleted');
        throw new AppError('Owner cannot be deleted', 403);
    }
    if (
        hrEmployeeRole === HrRole.SUPER_ADMIN &&
        userRole === HrRole.SUPER_ADMIN
    ) {
        Logger.error(
            'User dont have authority to delete super admin, cannot be deleted',
        );
        throw new AppError(
            'User dont have authority to delete super admin, cannot be deleted',
            403,
        );
    }
};

export const hrDashboardEntry = async (
    businessId: number,
    accountEmail: string,
) => {
    const account = await AccountRepository.findOneBy({ email: accountEmail });
    if (!account) {
        Logger.error('Account not found');
        throw new AppError('Account not found', 404);
    }

    const business = await BusinessRepository.findOneBy({ id: businessId });
    if (!business) {
        Logger.error('Business not found');
        throw new AppError('Business not found', 404);
    }

    return account.id;
};
