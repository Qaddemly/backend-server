import { ResumeTemplateRepository } from '../../Repository/ResumeTemplate/resumeTemplateRepository';
import AppError from '../../utils/appError';

import { ResumeTemplatePublicationRepository } from '../../Repository/ResumeTemplate/resumeTemplatePublicationRepository';
import {
    CreatePublicationContentBody,
    UpdatePublicationContentBody,
} from '../../dtos/resumeTemplate/resumeTemplatePublicationDto';

export const createPublicationContentService = async (
    resumeTemplateId: number,
    accountId: number,
    data: CreatePublicationContentBody,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOne({
        where: { id: resumeTemplateId, account_id: accountId },
    });
    if (!resumeTemplate) {
        throw new AppError('Resume Template not found', 404);
    }
    let date = null;
    if (data.date) {
        if (data.date.year) {
            date = `${data.date.year}`;
        }
        if (data.date.year && data.date.month) {
            date = `${data.date.month.toString().padStart(2, '0')}/${data.date.year}`;
        }

        if (data.date.year && data.date.month && data.date.day) {
            date = `${data.date.day.toString().padStart(2, '0')}/${data.date.month.toString().padStart(2, '0')}/${data.date.year}`;
        }
    }

    const newPublicationContent = ResumeTemplatePublicationRepository.create({
        title: data.title,
        publication_url: data.publication_url,
        publisher: data.publisher,
        date,
        description: data.description,
        resumeTemplate,
    });
    return await ResumeTemplatePublicationRepository.save(
        newPublicationContent,
    );
};

export const getOnePublicationContentService = async (
    resumeTemplateId: number,
    accountId: number,
    publicationContentId: number,
) => {
    const publicationContent =
        await ResumeTemplatePublicationRepository.findOne({
            where: {
                id: publicationContentId,
                resumeTemplate: {
                    id: resumeTemplateId,
                    account_id: accountId,
                },
            },
            relations: ['resumeTemplate'],
        });
    if (!publicationContent) {
        throw new AppError('publication Content not found', 404);
    }
    return publicationContent;
};

export const getAllPublicationsContentService = async (
    resumeTemplateId: number,
    accountId: number,
) => {
    const publicationsContent = await ResumeTemplatePublicationRepository.find({
        where: {
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });

    return publicationsContent;
};

export const updateOnePublicationContentService = async (
    resumeTemplateId: number,
    accountId: number,
    publicationContentId: number,
    data: UpdatePublicationContentBody,
) => {
    const publicationContent =
        await ResumeTemplatePublicationRepository.findOne({
            where: {
                id: publicationContentId,
                resumeTemplate: {
                    id: resumeTemplateId,
                    account_id: accountId,
                },
            },
            relations: ['resumeTemplate'],
        });
    if (!publicationContent) {
        throw new AppError('publication Content not found', 404);
    }
    let date = null;
    if (data.date) {
        if (data.date.year && !data.date.month) {
            date = `${data.date.year}`;
        } else if (data.date.year && data.date.month && !data.date.day) {
            date = `${data.date.month.toString().padStart(2, '0')}/${data.date.year}`;
        } else if (data.date.year && data.date.month && data.date.day) {
            date = `${data.date.day.toString().padStart(2, '0')}/${data.date.month.toString().padStart(2, '0')}/${data.date.year}`;
        } else publicationContent.date = null;
    }
    publicationContent.title = data.title || publicationContent.title;
    publicationContent.publication_url =
        data.publication_url || publicationContent.publication_url;
    publicationContent.publisher =
        data.publisher || publicationContent.publisher;
    publicationContent.date = date || publicationContent.date;
    publicationContent.description =
        data.description || publicationContent.description;

    return await ResumeTemplatePublicationRepository.save(publicationContent);
};

export const deleteOnePublicationContentService = async (
    resumeTemplateId: number,
    accountId: number,
    publicationContentId: number,
) => {
    const publicationContent =
        await ResumeTemplatePublicationRepository.findOne({
            where: {
                id: publicationContentId,
                resumeTemplate: {
                    id: resumeTemplateId,
                    account_id: accountId,
                },
            },
        });
    if (!publicationContent) {
        throw new AppError('publication Content not found', 404);
    }
    await ResumeTemplatePublicationRepository.remove(publicationContent);
};
