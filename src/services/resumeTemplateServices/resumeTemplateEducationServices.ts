import { ResumeTemplatePersonalInfoRepository } from '../../Repository/ResumeTemplate/resumeTemplatePersonalInfoRepository';
import { ResumeTemplateRepository } from '../../Repository/ResumeTemplate/resumeTemplateRepository';
import AppError from '../../utils/appError';
import { ResumeTemplateSkillRepository } from '../../Repository/ResumeTemplate/resumeTemplateSkillRepository';
import {
    CreateSkillContentBody,
    UpdateSkillContentBody,
} from '../../dtos/resumeTemplate/resumeTemplateSkillDto';
import { ResumeTemplateEducationRepository } from '../../Repository/ResumeTemplate/resumeTemplateEducationRepository';
import {
    CreateEducationContentBody,
    UpdateEducationContentBody,
} from '../../dtos/resumeTemplate/resumeTemplateEducationDto';

export const createEducationContentService = async (
    resumeTemplateId: number,
    accountId: number,
    data: CreateEducationContentBody,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOne({
        where: { id: resumeTemplateId, account_id: accountId },
    });
    if (!resumeTemplate) {
        throw new AppError('Resume Template not found', 404);
    }

    const newEducationContent = ResumeTemplateEducationRepository.create({
        school: data.school,
        school_link: data.school_link,
        degree: data.degree,
        city: data.city,
        country: data.country,
        start_date: data.start_date,
        end_date: data.end_date,
        is_current: data.is_current,
        description: data.description,
        resumeTemplate: resumeTemplate,
    });
    return await ResumeTemplateEducationRepository.save(newEducationContent);
};

export const getOneEducationContentService = async (
    resumeTemplateId: number,
    accountId: number,
    educationContentId: number,
) => {
    const educationContent = await ResumeTemplateEducationRepository.findOne({
        where: {
            id: educationContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });
    if (!educationContent) {
        throw new AppError('education Content not found', 404);
    }
    return educationContent;
};

export const getAllEducationsContentService = async (
    resumeTemplateId: number,
    accountId: number,
) => {
    const educationsContent = await ResumeTemplateEducationRepository.find({
        where: {
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });

    return educationsContent;
};

export const updateOneEducationContentService = async (
    resumeTemplateId: number,
    accountId: number,
    educationContentId: number,
    data: UpdateEducationContentBody,
) => {
    const educationContent = await ResumeTemplateEducationRepository.findOne({
        where: {
            id: educationContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });
    if (!educationContent) {
        throw new AppError('education Content not found', 404);
    }

    educationContent.school = data.school || educationContent.school;
    educationContent.school_link =
        data.school_link || educationContent.school_link;
    educationContent.degree = data.degree || educationContent.degree;
    educationContent.city = data.city || educationContent.city;
    educationContent.country = data.country || educationContent.country;
    educationContent.start_date =
        data.start_date || educationContent.start_date;
    educationContent.end_date = data.end_date || educationContent.end_date;
    educationContent.is_current =
        data.is_current || educationContent.is_current;
    educationContent.description =
        data.description || educationContent.description;

    return await ResumeTemplateEducationRepository.save(educationContent);
};

export const deleteOneEducationContentService = async (
    resumeTemplateId: number,
    accountId: number,
    educationContentId: number,
) => {
    const educationContent = await ResumeTemplateEducationRepository.findOne({
        where: {
            id: educationContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
    });
    if (!educationContent) {
        throw new AppError('education Content not found', 404);
    }
    await ResumeTemplateEducationRepository.remove(educationContent);
};
