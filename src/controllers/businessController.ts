import { NextFunction, Request, Response } from 'express';
import catchAsync from 'express-async-handler';
import { CreateBusinessDto, UpdateBusinessDTO } from '../dtos/businessDto';

import * as businessServices from './../services/businessServices';
import { HrRole } from '../enums/HrRole';
import { HrDashboardUserInfo } from '../types/request';
import { CountryCode } from '../enums/countryCode';

declare module 'express-serve-static-core' {
    interface Request {
        hrDashboardUserInfo?: HrDashboardUserInfo;
    }
}

export const createBusiness = catchAsync(
    async (req: Request<{}, {}, CreateBusinessDto>, res: Response) => {
        const business = await businessServices.createBusiness(
            req.body,
            req.user.id,
        );
        res.status(201).json({
            status: 'success',
            message: 'Business created successfully',
            business,
        });
    },
);

export const updateBusiness = catchAsync(
    async (
        req: Request<{ businessId: string }, {}, UpdateBusinessDTO>,
        res: Response,
    ) => {
        const business = await businessServices.updateBusiness(
            req.body,
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            message: 'Business updated successfully',
            business,
        });
    },
);

export const getBusinessById = catchAsync(
    async (req: Request<{ businessId: string }>, res: Response) => {
        const business = await businessServices.getBusinessById(
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            business,
        });
    },
);

export const searchBusinessByName = catchAsync(
    async (req: Request, res: Response) => {},
);

export const getUserBusinesses = catchAsync(
    async (req: Request, res: Response) => {
        const businesses =
            await businessServices.getBusinessesThatUserHasRoleIn(req.user.id);
        res.status(200).json({
            status: 'success',
            businesses,
        });
    },
);

export const getFiveReviewsOfBusiness = catchAsync(
    async (req: Request<{ businessId: string }>, res: Response) => {
        const reviews = await businessServices.getFiveReviewsOfBusiness(
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            reviews,
        });
    },
);

export const getSixJobsOfBusiness = catchAsync(
    async (req: Request<{ businessId: string }>, res: Response) => {
        const jobs = await businessServices.getSixJobsOfBusiness(
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            jobs,
        });
    },
);

export const getAllReviewsOfBusiness = catchAsync(
    async (req: Request<{ businessId: string }>, res: Response) => {
        const reviews = await businessServices.getAllReviewsOfBusiness(
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            reviews,
        });
    },
);
export const getAllJobsOfBusiness = catchAsync(
    async (req: Request<{ businessId: string }>, res: Response) => {
        const jobs = await businessServices.getAllJobsOfBusiness(
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            jobs,
        });
    },
);

export const getFollowersOfBusiness = catchAsync(
    async (req: Request, res: Response) => {
        const followers = await businessServices.getFollowersOfBusiness(
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            followers,
        });
    },
);

export const getFollowersNumberOfBusiness = catchAsync(
    async (req: Request, res: Response) => {
        const followers = await businessServices.getFollowersNumberOfBusiness(
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            followers,
        });
    },
);

export const addHrToBusiness = catchAsync(
    async (
        req: Request<
            { businessId: string },
            {},
            { account_email: string; role: HrRole }
        >,
        res: Response,
    ) => {
        await businessServices.addHrToBusiness(
            Number(req.params.businessId),
            req.hrDashboardUserInfo.toBeProcessedUserId,
            req.body.role,
        );
        res.status(201).json({
            status: 'success',
            message: 'HR added successfully',
        });
    },
);

export const updateHrRole = catchAsync(
    async (
        req: Request<
            { businessId: string },
            {},
            { account_email: string; role: HrRole }
        >,
        res: Response,
    ) => {
        await businessServices.updateHrRole(
            Number(req.params.businessId),
            req.hrDashboardUserInfo.toBeProcessedUserId,
            req.body.role,
        );
        res.status(200).json({
            status: 'success',
            message: 'HR role updated successfully',
        });
    },
);
export const deleteHr = catchAsync(
    async (
        req: Request<{ businessId: string }, {}, { account_email: string }>,
        res: Response,
    ) => {
        await businessServices.deleteHr(
            Number(req.params.businessId),
            req.hrDashboardUserInfo.toBeProcessedUserId,
        );
        res.status(200).json({
            status: 'success',
            message: 'HR deleted successfully',
        });
    },
);
export const getAllHrOfBusiness = catchAsync(
    async (req: Request<{ businessId: string }>, res: Response) => {
        const HRs = await businessServices.getAllHrOfBusiness(
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            HRs,
        });
    },
);
/**
 * Get role of the authenticated user in the business, and check if it's OWNER or SUPER_ADMIN
 * Then append role to the request object in `req.hrDashboardUserInfo.role`
 * */
export const checkOwnerOrSuperAdmin = catchAsync(
    async (req: Request, res: Response, next) => {
        if (!req.hrDashboardUserInfo) {
            req.hrDashboardUserInfo = {};
        }
        req.hrDashboardUserInfo.authenticatedUserRole =
            await businessServices.checkOwnerOrSuperAdmin(
                req.user.id,
                Number(req.params.businessId),
            );
        next();
    },
);

export const checkUpdateHrAuthority = catchAsync(
    async (req: Request, res: Response, next) => {
        await businessServices.checkUpdateHrAuthority(
            req.hrDashboardUserInfo.toBeProcessedUserId,
            Number(req.params.businessId),
            req.hrDashboardUserInfo.authenticatedUserRole,
            req.body.role,
        );
        next();
    },
);
/**
 * Validate business
 * - Business can only have 1 `OWNER`
 * - `OWNER` can add `SUPER_ADMIN`, `HIRING_MANAGER`, `RECRUITER`, `HR`
 * - `SUPER_ADMIN` can add `HIRING_MANAGER`, `RECRUITER`, `HR`
 * */
export const checkAddNewHrAuthority = catchAsync(
    async (req: Request, res: Response, next) => {
        await businessServices.checkAddNewHrAuthority(
            req.hrDashboardUserInfo.authenticatedUserRole,
            req.body.role,
        );
        next();
    },
);

export const checkDeleteHrAuthority = catchAsync(
    async (req: Request, res: Response, next) => {
        await businessServices.checkDeleteHrAuthority(
            req.hrDashboardUserInfo.authenticatedUserRole,
            req.hrDashboardUserInfo.toBeProcessedUserId,
            Number(req.params.businessId),
        );
        next();
    },
);
/**
 * Creates `req.hrDashboardUserInfo` object
 * Check if user email we want to add exists in database or not
 * Check if business id is valid or not
 * Append `toBeProcessedUserId` to the request object in `req.hrDashboardUserInfo.toBeProcessedUserId`
 * */
export const hrDashboardEntry = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.hrDashboardUserInfo) {
            req.hrDashboardUserInfo = {};
        }
        req.hrDashboardUserInfo.toBeProcessedUserId =
            await businessServices.hrDashboardEntry(
                Number(req.params.businessId),
                req.body.account_email,
            );
        next();
    },
);

/**
 * Get role of the current authenticated user in the business
 * If user do not have role return 403
 * */
export const checkRoleInBusiness = catchAsync(
    async (req: Request, res: Response, next) => {
        await businessServices.checkRoleInBusiness(
            req.user.id,
            Number(req.params.businessId),
        );
        next();
    },
);

export const getAllPhonesOfBusiness = catchAsync(
    async (
        req: Request<{ businessId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        const phoneNumbers = await businessServices.getAllPhonesOfBusiness(
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            phoneNumbers,
        });
    },
);

/**
 * @Description Add phone number to the business, user must be `OWNER` or `SUPER_ADMIN` to add phone number
 * @Body {country_code: string, phone_number: string}
 * @RequestParam {businessId: string}
 * @Note Before this middleware called, we already check that the user is `OWNER` or `SUPER_ADMIN`
 * */
export const addPhoneNumberToBusiness = catchAsync(
    async (
        req: Request<
            { businessId: string },
            {},
            { country_code: CountryCode; phone_number: string }
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const phone = await businessServices.addPhoneNumberToBusiness(
            Number(req.params.businessId),
            req.body.country_code,
            req.body.phone_number,
        );
        res.status(201).json({
            status: 'success',
            message: 'Phone number added successfully',
            phone,
        });
    },
);
export const updatePhoneNumberOfBusiness = catchAsync(
    async (
        req: Request<
            { businessId: string; phoneId: string },
            {},
            { country_code?: CountryCode; phone_number?: string }
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const phone = await businessServices.updatePhoneNumberOfBusiness(
            Number(req.params.businessId),
            Number(req.params.phoneId),
            req.body.country_code,
            req.body.phone_number,
        );
        res.status(200).json({
            status: 'success',
            message: 'Phone number updated successfully',
            phone,
        });
    },
);
export const deletePhoneNumberOfBusiness = catchAsync(
    async (
        req: Request<{ businessId: string; phoneId: string }>,
        res: Response,
        next: NextFunction,
    ) => {
        await businessServices.deletePhoneNumberOfBusiness(
            Number(req.params.businessId),
            Number(req.params.phoneId),
        );
        res.status(200).json({
            status: 'success',
            message: 'Phone number deleted successfully',
        });
    },
);
