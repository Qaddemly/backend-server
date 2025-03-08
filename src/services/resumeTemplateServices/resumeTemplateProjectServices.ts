import { ResumeTemplateRepository } from '../../Repository/ResumeTemplate/resumeTemplateRepository';
import AppError from '../../utils/appError';

import { ResumeTemplateProjectRepository } from '../../Repository/ResumeTemplate/resumeTemplateProjectRepository';
import {
    CreateProjectContentBody,
    UpdateProjectContentBody,
} from '../../dtos/resumeTemplate/resumeTemplateProjectDto';

export const createProjectContentService = async (
    resumeTemplateId: number,
    accountId: number,
    data: CreateProjectContentBody,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOne({
        where: { id: resumeTemplateId, account_id: accountId },
    });
    if (!resumeTemplate) {
        throw new AppError('Resume Template not found', 404);
    }
    let start_date = null;
    let end_date = null;
    if (data.start_year && !data.start_month) {
        start_date = `${data.start_year}`;
    } else if (data.start_year && data.start_month) {
        start_date = `${data.start_month.toString().padStart(2, '0')}/${data.start_year}`;
    }
    if (data.end_year && !data.end_month) {
        end_date = `${data.end_year}`;
    } else if (data.end_year && data.end_month) {
        end_date = `${data.end_month.toString().padStart(2, '0')}/${data.end_year}`;
    }
    const newProjectContent = ResumeTemplateProjectRepository.create({
        title: data.title,
        project_link: data.project_link,
        subtitle: data.subtitle,
        start_date: start_date,
        end_date: end_date,
        is_current: data.is_current,
        description: data.description,
        resumeTemplate: resumeTemplate,
    });
    return await ResumeTemplateProjectRepository.save(newProjectContent);
};

export const getOneProjectContentService = async (
    resumeTemplateId: number,
    accountId: number,
    projectContentId: number,
) => {
    const projectContent = await ResumeTemplateProjectRepository.findOne({
        where: {
            id: projectContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });
    if (!projectContent) {
        throw new AppError('project Content not found', 404);
    }
    return projectContent;
};

export const getAllProjectsContentService = async (
    resumeTemplateId: number,
    accountId: number,
) => {
    const projectsContent = await ResumeTemplateProjectRepository.find({
        where: {
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });

    return projectsContent;
};

export const updateOneProjectContentService = async (
    resumeTemplateId: number,
    accountId: number,
    projectContentId: number,
    data: UpdateProjectContentBody,
) => {
    const projectContent = await ResumeTemplateProjectRepository.findOne({
        where: {
            id: projectContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
        relations: ['resumeTemplate'],
    });
    if (!projectContent) {
        throw new AppError('project Content not found', 404);
    }
    let start_date = null;
    let end_date = null;
    if (data.start_year && !data.start_month) {
        start_date = `${data.start_year}`;
    } else if (data.start_year && data.start_month) {
        start_date = `${data.start_month.toString().padStart(2, '0')}/${data.start_year}`;
    } else if (data.start_month && !data.start_year) {
        projectContent.start_date = null;
    }
    if (data.end_year && !data.end_month) {
        end_date = `${data.end_year}`;
    } else if (data.end_year && data.end_month) {
        end_date = `${data.end_month.toString().padStart(2, '0')}/${data.end_year}`;
    } else if (data.end_month && !data.end_year) {
        projectContent.end_date = null;
    }
    projectContent.title = data.title || projectContent.title;
    projectContent.project_link =
        data.project_link || projectContent.project_link;
    projectContent.subtitle = data.subtitle || projectContent.subtitle;
    projectContent.start_date = start_date || projectContent.start_date;
    projectContent.end_date = end_date || projectContent.end_date;
    projectContent.is_current = data.is_current || projectContent.is_current;
    projectContent.description = data.description || projectContent.description;

    return await ResumeTemplateProjectRepository.save(projectContent);
};

export const deleteOneProjectContentService = async (
    resumeTemplateId: number,
    accountId: number,
    projectContentId: number,
) => {
    const projectContent = await ResumeTemplateProjectRepository.findOne({
        where: {
            id: projectContentId,
            resumeTemplate: {
                id: resumeTemplateId,
                account_id: accountId,
            },
        },
    });
    if (!projectContent) {
        throw new AppError('project Content not found', 404);
    }
    await ResumeTemplateProjectRepository.remove(projectContent);
};
