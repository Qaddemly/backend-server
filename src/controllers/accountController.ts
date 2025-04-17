import { NextFunction, Request, Response } from 'express';
import catchAsync from 'express-async-handler';

import * as accountServices from '../services/accountServices';
import { AccountRepository } from '../Repository/Account/accountRepository';
import { JobRepository } from '../Repository/Job/jobRepository';

export const followBusiness = catchAsync(
    async (req: Request, res: Response) => {
        const accountId = req.user.id;
        const businessId = parseInt(req.params.businessId);
        const followBusiness = await accountServices.followBusiness(
            accountId,
            businessId,
        );
        res.status(201).json({
            status: 'success',
            message: 'Business followed successfully',
        });
    },
);

export const unfollowBusiness = catchAsync(
    async (req: Request, res: Response) => {
        const accountId = req.user.id;
        const businessId = parseInt(req.params.businessId);
        await accountServices.unfollowBusiness(accountId, businessId);
        res.status(200).json({
            status: 'success',
            message: 'Business unfollowed successfully',
        });
    },
);

export const getFollowedBusinesses = catchAsync(
    async (req: Request, res: Response) => {
        const accountId = req.user.id;
        const followedBusinesses =
            await accountServices.getFollowedBusinesses(accountId);
        res.status(200).json({
            status: 'success',
            followedBusinesses: followedBusinesses.length,
            data: followedBusinesses,
        });
    },
);

export const getNumberOfUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const count = await accountServices.getNumberOfUsersService();
            res.status(200).json({
                success: true,
                count,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const testForAI = async (req, res, next) => {
    const { password, password_changed_at, is_activated, ...user } =
        await AccountRepository.createQueryBuilder('account')
            .leftJoinAndSelect('account.skills', 'skills')
            .leftJoinAndSelect('account.languages', 'languages')
            .leftJoinAndSelect('account.certificates', 'certificates')
            .leftJoinAndSelect('account.educations', 'educations')
            .leftJoinAndSelect('account.experiences', 'experiences')
            .leftJoinAndSelect('account.projects', 'projects')
            .where('account.id = :id', { id: 2 })
            .getOne();

    const job = await JobRepository.createQueryBuilder('job')
        .leftJoinAndSelect('job.business', 'business')
        .where('job.id = :id', { id: 28746 })
        .getOne();

    res.status(200).json({
        success: true,
        user,
        job,
    });
};
