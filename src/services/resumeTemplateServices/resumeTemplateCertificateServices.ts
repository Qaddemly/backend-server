import { ResumeTemplateRepository } from '../../Repository/ResumeTemplate/resumeTemplateRepository';
import AppError from '../../utils/appError';
import { ResumeTemplateCertificateRepository } from '../../Repository/ResumeTemplate/resumeTemplateCertificateRepository';

import {
    CreateCertificateContentBody,
    UpdateCertificateContentBody,
} from '../../dtos/resumeTemplate/resumeTemplateCertificateDto';

export const createCertificateContentService = async (
    resumeTemplateId: number,
    accountId: number,
    data: CreateCertificateContentBody,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOne({
        where: { id: resumeTemplateId, account_id: accountId },
    });
    if (!resumeTemplate) {
        throw new AppError('Resume Template not found', 404);
    }

    const newCertificateContent = ResumeTemplateCertificateRepository.create({
        certificate: data.certificate,
        certificate_url: data.certificate_url,
        additional_information: data.additional_information,
        resumeTemplate,
    });
    return await ResumeTemplateCertificateRepository.save(
        newCertificateContent,
    );
};

export const getOneCertificateContentService = async (
    resumeTemplateId: number,
    accountId: number,
    certificateContentId: number,
) => {
    const certificateContent =
        await ResumeTemplateCertificateRepository.findOne({
            where: {
                id: certificateContentId,
                resumeTemplate: {
                    id: resumeTemplateId,
                    account_id: accountId,
                },
            },
            relations: ['resumeTemplate'],
        });
    if (!certificateContent) {
        throw new AppError('certificate Content not found', 404);
    }
    return certificateContent;
};

export const getAllCertificatesContentService = async (
    resumeTemplateId: number,
    accountId: number,
) => {
    const certificatesContent = await ResumeTemplateCertificateRepository.find({
        where: {
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });

    return certificatesContent;
};

export const updateOneCertificateContentService = async (
    resumeTemplateId: number,
    accountId: number,
    certificateContentId: number,
    data: UpdateCertificateContentBody,
) => {
    const certificateContent =
        await ResumeTemplateCertificateRepository.findOne({
            where: {
                id: certificateContentId,
                resumeTemplate: {
                    id: resumeTemplateId,
                    account_id: accountId,
                },
            },
            relations: ['resumeTemplate'],
        });
    if (!certificateContent) {
        throw new AppError('certificate Content not found', 404);
    }
    certificateContent.certificate =
        data.certificate || certificateContent.certificate;
    certificateContent.certificate_url =
        data.certificate_url || certificateContent.certificate_url;
    certificateContent.additional_information =
        data.additional_information ||
        certificateContent.additional_information;

    return await ResumeTemplateCertificateRepository.save(certificateContent);
};

export const deleteOneCertificateContentService = async (
    resumeTemplateId: number,
    accountId: number,
    certificateContentId: number,
) => {
    const certificateContent =
        await ResumeTemplateCertificateRepository.findOne({
            where: {
                id: certificateContentId,
                resumeTemplate: {
                    id: resumeTemplateId,
                    account_id: accountId,
                },
            },
        });
    if (!certificateContent) {
        throw new AppError('certificate Content not found', 404);
    }
    await ResumeTemplateCertificateRepository.remove(certificateContent);
};
