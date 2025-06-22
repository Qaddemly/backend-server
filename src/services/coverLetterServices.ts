import {
    CreateCoverLetterDto,
    UpdateCoverLetterInfoDto,
} from '../dtos/coverLetter/coverLetter';
import { CreatePersonalDetailsContentBody } from '../dtos/coverLetter/personalDetails';
import { CoverLetter } from '../entity/CoverLetter/CoverLetter';
import { PersonalDetails } from '../entity/CoverLetter/PersonalDetails';
import { uploadSingleImage } from '../middlewares/upload.middleWare';
import { PersonalDetailsRepository } from '../Repository/coverLetter/coverLetterPersonalDetailsRepository';
import { CoverLetterRepository } from '../Repository/coverLetter/coverLetterRepository';
import catchAsync from 'express-async-handler';
import AppError from '../utils/appError';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';

export const createCoverLetterService = async (
    account_id: number,
    data: CreateCoverLetterDto,
) => {
    const coverLetter = new CoverLetter();
    coverLetter.name = data.name || 'Untitled';
    coverLetter.account_id = account_id;
    return await CoverLetterRepository.save(coverLetter);
};

export const getOneCoverLetterService = async (
    account_id: number,
    coverLetterId: number,
) => {
    const coverLetter = await CoverLetterRepository.findOne({
        where: { id: coverLetterId, account_id },
        relations: ['personalDetails'],
    });
    if (!coverLetter) {
        throw new AppError('Cover letter not found', 404);
    }
    return coverLetter;
};

export const getAllCoverLettersService = async (account_id: number) => {
    const coverLetters = await CoverLetterRepository.find({
        where: { account_id },
        relations: ['personalDetails'],
    });
    return coverLetters;
};

export const deleteCoverLetterService = async (
    account_id: number,
    coverLetterId: number,
) => {
    const coverLetter = await CoverLetterRepository.findOne({
        where: { id: coverLetterId, account_id },
    });
    if (!coverLetter) {
        throw new AppError('Cover letter not found', 404);
    }
    await CoverLetterRepository.remove(coverLetter);
};

export const updateCoverLetterInfoService = async (
    account_id: number,
    coverLetterId: number,
    data: UpdateCoverLetterInfoDto,
) => {
    const coverLetter = await CoverLetterRepository.findOne({
        where: { id: coverLetterId, account_id },
        relations: ['personalDetails'],
    });
    if (!coverLetter) {
        throw new AppError('Cover letter not found', 404);
    }
    coverLetter.name = data.name;
    coverLetter.date = data.date;
    coverLetter.body = data.body;
    if (data.recipientDetails) {
        coverLetter.recipientDetails.nameOfRecipient =
            data.recipientDetails?.nameOfRecipient || null;
        coverLetter.recipientDetails.companyName =
            data.recipientDetails?.companyName || null;
        coverLetter.recipientDetails.address =
            data.recipientDetails?.address || null;
    }
    return await CoverLetterRepository.save(coverLetter);
};

export const uploadPersonalDetailsImage = uploadSingleImage('picture');
export const resizePersonalDetailsImage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.file) {
                const personalDetailsImageName = `personalDetails-${Math.round(
                    Math.random() * 1e9,
                )}-${Date.now()}.jpeg`;
                const imageDbUrl = `${process.env.BASE_URL}/uploads/coverLetters/personalDetails/${personalDetailsImageName}`;
                await sharp(req.file.buffer)
                    .resize(800, 600)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(
                        `src/uploads/coverLetters/personalDetails/${personalDetailsImageName}`,
                    );
                req.body.picture = imageDbUrl;
            }

            next();
        } catch (err) {
            const customError = new AppError('error while saving file');
            customError.stack = err.stack;
            return next(customError);
        }
    },
);

export const createCoverLetterPersonalDetailsService = async (
    account_id: number,
    coverLetterId: number,
    data: CreatePersonalDetailsContentBody,
) => {
    const coverLetter = await CoverLetterRepository.findOne({
        where: { id: coverLetterId, account_id },
    });
    if (!coverLetter) {
        throw new AppError('Cover letter not found', 404);
    }
    const foundPersonalDetails = await PersonalDetailsRepository.findOne({
        where: { coverLetter: { id: coverLetterId } },
    });
    if (foundPersonalDetails) {
        throw new AppError(
            'Personal details already exist for this cover letter',
            400,
        );
    }
    const newPersonalDetails = new PersonalDetails();
    newPersonalDetails.full_name = data.full_name;
    newPersonalDetails.job_title = data.job_title;
    newPersonalDetails.email = data.email;
    newPersonalDetails.phone_number = data.phone_number;
    newPersonalDetails.address = data.address;
    newPersonalDetails.picture = data.picture;
    newPersonalDetails.personal_information = data.personal_information;
    newPersonalDetails.links = data.links;
    newPersonalDetails.coverLetter = coverLetter;
    return await PersonalDetailsRepository.save(newPersonalDetails);
};

export const getCoverLetterPersonalDetailsService = async (
    account_id: number,
    coverLetterId: number,
) => {
    const coverLetter = await CoverLetterRepository.findOne({
        where: { id: coverLetterId, account_id },
    });
    if (!coverLetter) {
        throw new AppError('Cover letter not found', 404);
    }
    const personalDetails = await PersonalDetailsRepository.findOne({
        where: { coverLetter: { id: coverLetterId } },
    });
    if (!personalDetails) {
        throw new AppError(
            'Personal details not found for this cover letter',
            404,
        );
    }
    return personalDetails;
};

export const updateCoverLetterPersonalDetailsService = async (
    account_id: number,
    coverLetterId: number,
    data: CreatePersonalDetailsContentBody,
) => {
    const coverLetter = await CoverLetterRepository.findOne({
        where: { id: coverLetterId, account_id },
    });
    if (!coverLetter) {
        throw new AppError('Cover letter not found', 404);
    }
    const personalDetails = await PersonalDetailsRepository.findOne({
        where: { coverLetter: { id: coverLetterId } },
    });
    if (!personalDetails) {
        throw new AppError(
            'Personal details not found for this cover letter',
            404,
        );
    }
    personalDetails.full_name = data.full_name;
    personalDetails.job_title = data.job_title;
    personalDetails.email = data.email;
    personalDetails.phone_number = data.phone_number;
    personalDetails.address = data.address;
    personalDetails.picture = data.picture;
    personalDetails.personal_information = data.personal_information;
    personalDetails.links = data.links;
    personalDetails.coverLetter = coverLetter;
    return await PersonalDetailsRepository.save(personalDetails);
};

export const deleteCoverLetterPersonalDetailsService = async (
    account_id: number,
    coverLetterId: number,
) => {
    const coverLetter = await CoverLetterRepository.findOne({
        where: { id: coverLetterId, account_id },
    });
    if (!coverLetter) {
        throw new AppError('Cover letter not found', 404);
    }
    const personalDetails = await PersonalDetailsRepository.findOne({
        where: { coverLetter: { id: coverLetterId } },
    });
    if (!personalDetails) {
        throw new AppError(
            'Personal details not found for this cover letter',
            404,
        );
    }
    await PersonalDetailsRepository.remove(personalDetails);
};
