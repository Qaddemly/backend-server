import { NextFunction, Request, Response } from 'express';
import { CoverLetterRepository } from '../Repository/coverLetter/coverLetterRepository';
import { resumeTemplateRouter } from '../routes/resumeTemplateRoutes';
import catchAsync from 'express-async-handler';
import * as CoverLetterService from '../services/coverLetterServices';

export const createCoverLetter = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account_id = req.user.id;
            const data = req.body;
            const coverLetter =
                await CoverLetterService.createCoverLetterService(
                    account_id,
                    data,
                );
            res.status(201).json({
                status: 'success',
                message: 'Cover letter created successfully',
                coverLetter,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getAllCoverLettersOfUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account_id = req.user.id;
            const coverLetters =
                await CoverLetterService.getAllCoverLettersService(account_id);
            res.status(200).json({
                status: 'success',
                coverLetters,
            });
        } catch (err) {
            return next(err);
        }
    },
);
export const getOneCoverLetterById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account_id = req.user.id;
            const coverLetterId = Number(req.params.coverLetterId);
            const coverLetter =
                await CoverLetterService.getOneCoverLetterService(
                    account_id,
                    coverLetterId,
                );
            res.status(200).json({
                status: 'success',
                coverLetter,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteCoverLetter = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account_id = req.user.id;
            const coverLetterId = Number(req.params.coverLetterId);

            await CoverLetterService.deleteCoverLetterService(
                account_id,
                coverLetterId,
            );
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);
export const updateCoverLetterInfo = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account_id = req.user.id;
            const coverLetterId = Number(req.params.coverLetterId);
            const data = req.body;
            const coverLetter =
                await CoverLetterService.updateCoverLetterInfoService(
                    account_id,
                    coverLetterId,
                    data,
                );
            res.status(200).json({
                status: 'success',
                message: 'Cover letter updated successfully',
                coverLetter,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const createCoverLetterPersonalDetails = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account_id = req.user.id;
            const coverLetterId = Number(req.params.coverLetterId);
            const data = req.body;
            const personalDetails =
                await CoverLetterService.createCoverLetterPersonalDetailsService(
                    account_id,
                    coverLetterId,
                    data,
                );
            res.status(201).json({
                status: 'success',
                message: 'Personal Details created successfully',
                personalDetails,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const getCoverLetterPersonalDetails = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account_id = req.user.id;
            const coverLetterId = Number(req.params.coverLetterId);
            const personalDetails =
                await CoverLetterService.getCoverLetterPersonalDetailsService(
                    account_id,
                    coverLetterId,
                );
            res.status(200).json({
                status: 'success',
                personalDetails,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteCoverLetterPersonalDetails = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account_id = req.user.id;
            const coverLetterId = Number(req.params.coverLetterId);

            await CoverLetterService.deleteCoverLetterPersonalDetailsService(
                account_id,
                coverLetterId,
            );
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);
export const updateCoverLetterPersonalDetails = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const account_id = req.user.id;
            const coverLetterId = Number(req.params.coverLetterId);
            const data = req.body;
            const personalDetails =
                await CoverLetterService.updateCoverLetterPersonalDetailsService(
                    account_id,
                    coverLetterId,
                    data,
                );
            res.status(200).json({
                status: 'success',
                message: 'personal info updated successfully',
                personalDetails,
            });
        } catch (err) {
            return next(err);
        }
    },
);
