import { ResumeTemplateRepository } from '../../Repository/ResumeTemplate/resumeTemplateRepository';
import AppError from '../../utils/appError';

import { ResumeTemplateAwardRepository } from '../../Repository/ResumeTemplate/resumeTemplateAwardRepository';
import {
    CreateAwardContentBody,
    UpdateAwardContentBody,
} from '../../dtos/resumeTemplate/resumeTemplateAwardDto';

export const createAwardContentService = async (
    resumeTemplateId: number,
    accountId: number,
    data: CreateAwardContentBody,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOne({
        where: { id: resumeTemplateId, account_id: accountId },
    });
    if (!resumeTemplate) {
        throw new AppError('Resume Template not found', 404);
    }
    // let date = null;
    // if (data.date) {
    //     if (data.date.year) {
    //         date = `${data.date.year}`;
    //     }
    //     if (data.date.year && data.date.month) {
    //         date = `${data.date.month.toString().padStart(2, '0')}/${data.date.year}`;
    //     }

    //     if (data.date.year && data.date.month && data.date.day) {
    //         date = `${data.date.day.toString().padStart(2, '0')}/${data.date.month.toString().padStart(2, '0')}/${data.date.year}`;
    //     }
    // }

    const newAwardContent = ResumeTemplateAwardRepository.create({
        award: data.award,
        award_url: data.award_url,
        issuer: data.issuer,
        date: data.date,
        description: data.description,
        resumeTemplate,
    });
    return await ResumeTemplateAwardRepository.save(newAwardContent);
};

export const getOneAwardContentService = async (
    resumeTemplateId: number,
    accountId: number,
    awardContentId: number,
) => {
    const awardContent = await ResumeTemplateAwardRepository.findOne({
        where: {
            id: awardContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });
    if (!awardContent) {
        throw new AppError('award Content not found', 404);
    }
    return awardContent;
};

export const getAllAwardsContentService = async (
    resumeTemplateId: number,
    accountId: number,
) => {
    const awardsContent = await ResumeTemplateAwardRepository.find({
        where: {
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });

    return awardsContent;
};

export const updateOneAwardContentService = async (
    resumeTemplateId: number,
    accountId: number,
    awardContentId: number,
    data: UpdateAwardContentBody,
) => {
    const awardContent = await ResumeTemplateAwardRepository.findOne({
        where: {
            id: awardContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });
    if (!awardContent) {
        throw new AppError('award Content not found', 404);
    }
    // let date = null;
    // if (data.date) {
    //     if (data.date.year && !data.date.month) {
    //         date = `${data.date.year}`;
    //     } else if (data.date.year && data.date.month && !data.date.day) {
    //         date = `${data.date.month.toString().padStart(2, '0')}/${data.date.year}`;
    //     } else if (data.date.year && data.date.month && data.date.day) {
    //         date = `${data.date.day.toString().padStart(2, '0')}/${data.date.month.toString().padStart(2, '0')}/${data.date.year}`;
    //     } else awardContent.date = null;
    // }
    awardContent.award = data.award || awardContent.award;
    awardContent.award_url = data.award_url || awardContent.award_url;
    awardContent.issuer = data.issuer || awardContent.issuer;
    awardContent.date = data.date || awardContent.date;
    awardContent.description = data.description || awardContent.description;

    return await ResumeTemplateAwardRepository.save(awardContent);
};

export const deleteOneAwardContentService = async (
    resumeTemplateId: number,
    accountId: number,
    awardContentId: number,
) => {
    const awardContent = await ResumeTemplateAwardRepository.findOne({
        where: {
            id: awardContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
    });
    if (!awardContent) {
        throw new AppError('award Content not found', 404);
    }
    await ResumeTemplateAwardRepository.remove(awardContent);
};
