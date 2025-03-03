import { ResumeTemplateRepository } from '../Repository/ResumeTemplate/resumeTemplateRepository';
import { ResumeTemplate } from '../entity/ResumeTemplate/ResumeTemplate';
import { Account } from '../entity/Account/Account';
import { ResumeTemplateExperience } from '../entity/ResumeTemplate/ResumeTemplateExperience';
import { ResumeExperienceRepository } from '../Repository/ResumeTemplate/ResumeExperienceRepository';
import { createOrUpdateResumeExperienceDto } from '../dtos/resumeTemplateDto';

export const getAllResumeTemplatesOfUser = async (userId: number) => {
    return await ResumeTemplateRepository.findBy({ account_id: userId });
};

export const getResumeTemplatesById = async (
    userId: number,
    resumeTemplateId: number,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOneBy({
        account_id: userId,
        id: resumeTemplateId,
    });
    if (!resumeTemplate) {
        throw new Error('Resume Template not found');
    }
    return resumeTemplate;
};
export const createResumeTemplate = async (userId: number, data: any) => {
    const resumeTemplate = new ResumeTemplate();
    resumeTemplate.account_id = userId;
    return await ResumeTemplateRepository.save(resumeTemplate);
};
export const deleteResumeTemplate = async (
    userId: number,
    resumeTemplateId: number,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOneBy({
        account_id: userId,
        id: resumeTemplateId,
    });
    if (!resumeTemplate) {
        throw new Error('Resume Template not found');
    }
    await ResumeTemplateRepository.remove(resumeTemplate);
};
export const updateProfileOfResumeTemplate = async (
    userId: number,
    resumeTemplateId: number,
    profile: string,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOneBy({
        account_id: userId,
        id: resumeTemplateId,
    });
    if (!resumeTemplate) {
        throw new Error('Resume Template not found');
    }
    resumeTemplate.profile = profile;
    return await ResumeTemplateRepository.save(resumeTemplate);
};
export const createExperienceOfResumeTemplate = async (
    userId: number,
    resumeTemplateId: number,
    createExperienceDTO: createOrUpdateResumeExperienceDto,
) => {
    const resumeTemplate = await ResumeTemplateRepository.findOneBy({
        account_id: userId,
        id: resumeTemplateId,
    });
    if (!resumeTemplate) {
        throw new Error('Resume Template not found');
    }
    const experience = new ResumeTemplateExperience();
    experience.job_title = createExperienceDTO.job_title;
    experience.company_name = createExperienceDTO.company_name;
    experience.city = createExperienceDTO.city;
    experience.country = createExperienceDTO.country;
    experience.start_date = createExperienceDTO.start_date;
    experience.end_date = createExperienceDTO.end_date;
    experience.is_current = createExperienceDTO.is_current;
    experience.description = createExperienceDTO.description;
    experience.resume_template_id = resumeTemplateId;
    return await ResumeExperienceRepository.save(experience);
};
export const getExperienceOfResumeTemplate = async (
    resumeTemplateId: number,
    experienceId: number,
) => {
    const experience = await ResumeExperienceRepository.findOneBy({
        resume_template_id: resumeTemplateId,
        id: experienceId,
    });
    if (!experience) {
        throw new Error('Experience not found');
    }
    return experience;
};
export const getAllExperiencesOfResumeTemplate = async (resumeId: number) => {
    const resumeTemplate = await ResumeTemplateRepository.findOneBy({
        id: resumeId,
    });
    if (!resumeTemplate) {
        throw new Error('Resume Template not found');
    }

    return await ResumeExperienceRepository.findBy({
        resume_template_id: resumeId,
    });
};
export const updateExperienceOfResumeTemplate = async (
    resumeId: number,
    experienceId: number,
    updateExperienceDTO: createOrUpdateResumeExperienceDto,
) => {
    const experience = await ResumeExperienceRepository.findOneBy({
        resume_template_id: resumeId,
        id: experienceId,
    });
    if (!experience) {
        throw new Error('Experience not found');
    }
    if (updateExperienceDTO.job_title) {
        experience.job_title = updateExperienceDTO.job_title;
    }
    if (updateExperienceDTO.company_name) {
        experience.company_name = updateExperienceDTO.company_name;
    }
    if (updateExperienceDTO.city) {
        experience.city = updateExperienceDTO.city;
    }
    if (updateExperienceDTO.country) {
        experience.country = updateExperienceDTO.country;
    }
    if (updateExperienceDTO.start_date) {
        experience.start_date = updateExperienceDTO.start_date;
    }
    if (updateExperienceDTO.end_date) {
        experience.end_date = updateExperienceDTO.end_date;
    }
    if (updateExperienceDTO.is_current) {
        experience.is_current = updateExperienceDTO.is_current;
    }
    if (updateExperienceDTO.description) {
        experience.description = updateExperienceDTO.description;
    }
    return await ResumeExperienceRepository.save(experience);
};
export const deleteExperienceOfResumeTemplate = async (
    resumeId: number,
    experienceId: number,
) => {
    const experience = await ResumeExperienceRepository.findOneBy({
        resume_template_id: resumeId,
        id: experienceId,
    });
    if (!experience) {
        throw new Error('Experience not found');
    }
    await ResumeExperienceRepository.remove(experience);
};
