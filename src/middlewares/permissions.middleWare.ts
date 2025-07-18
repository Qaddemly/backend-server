import catchAsync from 'express-async-handler';
import { HrRole } from '../enums/HrRole';
import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import { HrEmployeeRepository } from '../Repository/Business/hrEmployeeRepository';
import { BusinessRepository } from '../Repository/Business/businessRepository';
import { JobRepository } from '../Repository/Job/jobRepository';
export const hasPermissionOnBusiness = async (
    userId: number,
    businessId: number,
    userRules: HrRole[],
) => {
    const hasPermission = await HrEmployeeRepository.checkPermission(
        userId,
        businessId,
        userRules,
    );
    return hasPermission;
};

export const hasPermissionToPostJob = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user.id;
        const businessId = Number(req.body.business_id);
        const userRules = [
            HrRole.HIRING_MANAGER,
            HrRole.SUPER_ADMIN,
            HrRole.HR,
            HrRole.RECRUITER,
            HrRole.OWNER,
        ];
        const hasPermission = await hasPermissionOnBusiness(
            userId,
            businessId,
            userRules,
        );

        if (!hasPermission) {
            return next(
                new AppError(
                    'You do not have permission to post a job in this business.',
                    403,
                ),
            );
        }
        return next();
    },
);

export const hasPermissionToUpdateJob = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user.id;
        const jobId = Number(req.params.id);

        const job = await JobRepository.findOne({
            where: { id: jobId },
        });
        if (!job) {
            return next(new AppError('Job not found', 404));
        }
        const businessId = job.business_id;
        const userRules = [
            HrRole.HIRING_MANAGER,
            HrRole.SUPER_ADMIN,
            HrRole.HR,
            HrRole.RECRUITER,
            HrRole.OWNER,
        ];
        const hasPermission = await hasPermissionOnBusiness(
            userId,
            businessId,
            userRules,
        );

        if (!hasPermission) {
            return next(
                new AppError(
                    'You do not have permission to update a job in this business.',
                    403,
                ),
            );
        }
        return next();
    },
);
