import { NextFunction, Request, Response } from 'express';
import {
    CreatePersonalInfoContentBody,
    UpdatePersonalInfoContentBody,
} from '../../dtos/resumeTemplate/resumeTemplatePersonalInfoDto';
import { uploadSingleImage } from '../../middlewares/upload.middleWare';
import { ResumeTemplatePersonalInfoRepository } from '../../Repository/ResumeTemplate/resumeTemplatePersonalInfoRepository';
import { ResumeTemplateRepository } from '../../Repository/ResumeTemplate/resumeTemplateRepository';
import AppError from '../../utils/appError';
import catchAsync from 'express-async-handler';
import sharp from 'sharp';
export const uploadPersonalInfoImage = uploadSingleImage('picture');
export const resizePersonalInfoImage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.file) {
                const personalInfoImageName = `personalInfo-${Math.round(
                    Math.random() * 1e9,
                )}-${Date.now()}.jpeg`;
                const imageDbUrl = `${process.env.BASE_URL}/uploads/resumeTemplates/personalInfo/${personalInfoImageName}`;
                await sharp(req.file.buffer)
                    .resize(800, 600)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(
                        `src/uploads/resumeTemplates/personalInfo/${personalInfoImageName}`,
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

export const createPersonalInfoContentService = async (
    resumeTemplateId: number,
    accountId: number,
    data: CreatePersonalInfoContentBody,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOne({
        where: { id: resumeTemplateId, account_id: accountId },
    });
    if (!resumeTemplate) {
        throw new AppError('Resume Template not found', 404);
    }
    data;
    const personalInfoContent =
        await ResumeTemplatePersonalInfoRepository.findOne({
            where: { resumeTemplate },
        });
    if (personalInfoContent) {
        throw new AppError('Personal Info Content already exists', 400);
    }
    const newPersonalInfoContent = ResumeTemplatePersonalInfoRepository.create({
        full_name: data.full_name,
        job_title: data.job_title,
        email: data.email,
        phone_number: data.phone_number,
        address: data.address,
        picture: data.picture,
        personal_information: data.personal_information,
        links: data.links,
        resumeTemplate,
    });
    return await ResumeTemplatePersonalInfoRepository.save(
        newPersonalInfoContent,
    );
};

export const getOnePersonalInfoContentService = async (
    resumeTemplateId: number,
    accountId: number,
    //personaInfoContentId: number,
) => {
    const personalInfoContent =
        await ResumeTemplatePersonalInfoRepository.findOne({
            where: {
                // id: personaInfoContentId,
                resumeTemplate: {
                    id: resumeTemplateId,
                    account_id: accountId,
                },
            },
            relations: ['resumeTemplate'],
        });
    if (!personalInfoContent) {
        throw new AppError('Personal Info Content not found', 404);
    }
    return personalInfoContent;
};

export const updateOnePersonalInfoContentService = async (
    resumeTemplateId: number,
    accountId: number,
    personaInfoContentId: number,
    data: UpdatePersonalInfoContentBody,
) => {
    const personalInfoContent =
        await ResumeTemplatePersonalInfoRepository.findOne({
            where: {
                id: personaInfoContentId,
                resumeTemplate: {
                    id: resumeTemplateId,
                    account_id: accountId,
                },
            },
            relations: ['resumeTemplate'],
        });
    if (!personalInfoContent) {
        throw new AppError('Personal Info Content not found', 404);
    }
    personalInfoContent.full_name =
        data.full_name || personalInfoContent.full_name;
    personalInfoContent.job_title =
        data.job_title || personalInfoContent.job_title;
    personalInfoContent.email = data.email || personalInfoContent.email;
    personalInfoContent.phone_number =
        data.phone_number || personalInfoContent.phone_number;
    personalInfoContent.address = data.address || personalInfoContent.address;
    personalInfoContent.picture = data.picture || personalInfoContent.picture;
    personalInfoContent.personal_information =
        data.personal_information || personalInfoContent.personal_information;
    personalInfoContent.links = data.links || personalInfoContent.links;
    return await ResumeTemplatePersonalInfoRepository.save(personalInfoContent);
};

export const deleteOnePersonalInfoContentService = async (
    resumeTemplateId: number,
    accountId: number,
    personaInfoContentId: number,
) => {
    const personalInfoContent =
        await ResumeTemplatePersonalInfoRepository.findOne({
            where: {
                id: personaInfoContentId,
                resumeTemplate: {
                    id: resumeTemplateId,
                    account_id: accountId,
                },
            },
        });
    if (!personalInfoContent) {
        throw new AppError('Personal Info Content not found', 404);
    }
    await ResumeTemplatePersonalInfoRepository.remove(personalInfoContent);
};
