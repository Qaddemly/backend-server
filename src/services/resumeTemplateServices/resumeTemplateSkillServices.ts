import { ResumeTemplatePersonalInfoRepository } from '../../Repository/ResumeTemplate/resumeTemplatePersonalInfoRepository';
import { ResumeTemplateRepository } from '../../Repository/ResumeTemplate/resumeTemplateRepository';
import AppError from '../../utils/appError';
import { ResumeTemplateSkillRepository } from '../../Repository/ResumeTemplate/resumeTemplateSkillRepository';
import {
    CreateSkillContentBody,
    UpdateSkillContentBody,
} from '../../dtos/resumeTemplate/resumeTemplateSkillDto';

export const createSkillContentService = async (
    resumeTemplateId: number,
    accountId: number,
    data: CreateSkillContentBody,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOne({
        where: { id: resumeTemplateId, account_id: accountId },
    });
    if (!resumeTemplate) {
        throw new AppError('Resume Template not found', 404);
    }

    const newSkillContent = ResumeTemplateSkillRepository.create({
        name: data.name,
        information: data.information,
        level: data.level,
        resumeTemplate,
    });
    return await ResumeTemplateSkillRepository.save(newSkillContent);
};

export const getOneSkillContentService = async (
    resumeTemplateId: number,
    accountId: number,
    skillContentId: number,
) => {
    const skillContent = await ResumeTemplateSkillRepository.findOne({
        where: {
            id: skillContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });
    if (!skillContent) {
        throw new AppError('skill Content not found', 404);
    }
    return skillContent;
};

export const getAllSkillsContentService = async (
    resumeTemplateId: number,
    accountId: number,
) => {
    const skillsContent = await ResumeTemplateSkillRepository.find({
        where: {
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });

    return skillsContent;
};

export const updateOneSkillContentService = async (
    resumeTemplateId: number,
    accountId: number,
    skillContentId: number,
    data: UpdateSkillContentBody,
) => {
    const skillContent = await ResumeTemplateSkillRepository.findOne({
        where: {
            id: skillContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });
    if (!skillContent) {
        throw new AppError('skill Content not found', 404);
    }
    skillContent.name = data.name || skillContent.name;
    skillContent.information = data.information || skillContent.information;
    skillContent.level = data.level || skillContent.level;

    return await ResumeTemplateSkillRepository.save(skillContent);
};

export const deleteOneSkillContentService = async (
    resumeTemplateId: number,
    accountId: number,
    skillContentId: number,
) => {
    const skillContent = await ResumeTemplateSkillRepository.findOne({
        where: {
            id: skillContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
    });
    if (!skillContent) {
        throw new AppError('skill Content not found', 404);
    }
    await ResumeTemplateSkillRepository.remove(skillContent);
};
