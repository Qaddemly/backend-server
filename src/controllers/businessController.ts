import { NextFunction, Request, Response } from 'express';
import catchAsync from 'express-async-handler';
import { CreateBusinessDto, UpdateBusinessDTO } from '../dtos/businessDto';

import * as businessServices from './../services/businessServices';
import { RequestWithHrDashboard } from '../types/request';

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
            req.user.id,
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

// ----------------- Hr -----------------
export const addHrToBusiness = catchAsync(
    async (req: Request, res: Response) => {
        await businessServices.addHrToBusiness(
            req.user.id,
            Number(req.params.businessId),
            req.body.account_email,
            req.body.role,
        );
        res.status(201).json({
            status: 'success',
            message: 'HR added successfully',
        });
    },
);

export const updateHrRole = catchAsync(
    async (req: RequestWithHrDashboard, res: Response) => {
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
export const deleteHr = catchAsync(async (req: RequestWithHrDashboard, res) => {
    await businessServices.deleteHr(
        Number(req.params.businessId),
        req.hrDashboardUserInfo.toBeProcessedUserId,
    );
    res.status(200).json({
        status: 'success',
        message: 'HR deleted successfully',
    });
});
export const getAllHrOfBusiness = catchAsync(
    async (req: RequestWithHrDashboard, res: Response) => {
        const HRs = await businessServices.getAllHrOfBusiness(
            Number(req.params.businessId),
        );
        res.status(200).json({
            status: 'success',
            HRs,
        });
    },
);

export const checkBusinessDashboardAuthority = catchAsync(
    async (req: RequestWithHrDashboard, res: Response, next) => {
        if (!req.hrDashboardUserInfo) {
            req.hrDashboardUserInfo = {};
        }
        req.hrDashboardUserInfo.role =
            await businessServices.checkBusinessDashboardAuthority(
                req.user.id,
                Number(req.params.businessId),
            );
        next();
    },
);

export const checkUpdateSuperAdminAuthority = catchAsync(
    async (req: RequestWithHrDashboard, res: Response, next) => {
        await businessServices.checkUpdateSuperAdminAuthority(
            req.hrDashboardUserInfo.role,
            req.body.role,
        );
        next();
    },
);
export const checkAddNewHrAuthority = catchAsync(
    async (req: RequestWithHrDashboard, res: Response, next) => {
        await businessServices.checkAddNewHrAuthority(
            req.hrDashboardUserInfo.role,
            req.body.role,
        );
        next();
    },
);

export const checkDeleteHrAuthority = catchAsync(
    async (req: RequestWithHrDashboard, res: Response, next) => {
        await businessServices.checkDeleteHrAuthority(
            req.hrDashboardUserInfo.role,
            req.hrDashboardUserInfo.toBeProcessedUserId,
            Number(req.params.businessId),
        );
        next();
    },
);

export const hrDashboardEntry = catchAsync(
    async (req: RequestWithHrDashboard, res: Response, next: NextFunction) => {
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
