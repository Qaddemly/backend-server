import { ResumeTemplateRepository } from '../Repository/ResumeTemplate/resumeTemplateRepository';
import { ResumeTemplate } from '../entity/ResumeTemplate/ResumeTemplate';
import { Account } from '../entity/Account/Account';
import { ResumeTemplateExperience } from '../entity/ResumeTemplate/ResumeTemplateExperience';
import { ResumeExperienceRepository } from '../Repository/ResumeTemplate/ResumeExperienceRepository';
import {
    createOrUpdateCourseDTO,
    createOrUpdateCustomSectionDTO,
    createOrUpdateInterestDTO,
    createOrUpdateLanguageDTO,
    createOrUpdateOrganizationDTO,
    createOrUpdateReferenceDTO,
    createOrUpdateResumeExperienceDTO,
} from '../dtos/resumeTemplateDto';
import { ResumeLanguage } from '../entity/ResumeTemplate/ResumeLanguage';
import { AppDataSource } from '../data-source';
import { LanguageRepository } from '../Repository/Account/languageRepository';
import { ResumeInterest } from '../entity/ResumeTemplate/ResumeInterest';
import { ResumeCourse } from '../entity/ResumeTemplate/ResumeCourse';
import { ResumeOrganization } from '../entity/ResumeTemplate/ResumeOrganization';
import { ResumeCustomSection } from '../entity/ResumeTemplate/ResumeCustomSection';
import { ResumeReference } from '../entity/ResumeTemplate/ResumeReference';

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
    createExperienceDTO: createOrUpdateResumeExperienceDTO,
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
    updateExperienceDTO: createOrUpdateResumeExperienceDTO,
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
export const createLanguageOfResumeTemplate = async (
    resumeId: number,
    createLanguageDTO: createOrUpdateLanguageDTO,
) => {
    const language = new ResumeLanguage();
    language.language = createLanguageDTO.language;
    language.level = createLanguageDTO.level;
    language.additional_info = createLanguageDTO.additional_info;
    language.resume_template_id = resumeId;
    return await AppDataSource.getRepository(ResumeLanguage).save(language);
};
export const getLanguageOfResumeTemplate = async (
    resumeId: number,
    languageId: number,
) => {
    const language = await AppDataSource.getRepository(ResumeLanguage).findOne({
        where: {
            resume_template_id: resumeId,
            id: languageId,
        },
    });
    if (!language) {
        throw new Error('Language not found');
    }
    return language;
};
export const getAllLanguagesOfResumeTemplate = async (resumeId: number) => {
    return await AppDataSource.getRepository(ResumeLanguage).findBy({
        resume_template_id: resumeId,
    });
};
export const updateLanguageOfResumeTemplate = async (
    resumeId: number,
    languageId: number,
    createLanguageDTO: createOrUpdateLanguageDTO,
) => {
    const languageEntity = await AppDataSource.getRepository(
        ResumeLanguage,
    ).findOneBy({
        resume_template_id: resumeId,
        id: languageId,
    });
    if (!languageEntity) {
        throw new Error('Language not found');
    }
    if (createLanguageDTO.language) {
        languageEntity.language = createLanguageDTO.language;
    }
    if (createLanguageDTO.level) {
        languageEntity.level = createLanguageDTO.level;
    }
    if (createLanguageDTO.additional_info) {
        languageEntity.additional_info = createLanguageDTO.additional_info;
    }
    return await AppDataSource.getRepository(ResumeLanguage).save(
        languageEntity,
    );
};
export const deleteLanguageOfResumeTemplate = async (
    resumeId: number,
    languageId: number,
) => {
    const languageEntity = await AppDataSource.getRepository(
        ResumeLanguage,
    ).findOneBy({
        resume_template_id: resumeId,
        id: languageId,
    });
    if (!languageEntity) {
        throw new Error('Language not found');
    }
    await AppDataSource.getRepository(ResumeLanguage).remove(languageEntity);
};
export const createInterestOfResumeTemplate = async (
    resumeId: number,
    createInterestDTO: createOrUpdateInterestDTO,
) => {
    const interest = new ResumeInterest();
    interest.interest = createInterestDTO.interest;
    interest.description = createInterestDTO.description;
    interest.resume_template_id = resumeId;
    return await AppDataSource.getRepository(ResumeInterest).save(interest);
};
export const getInterestOfResumeTemplate = async (
    resumeId: number,
    interestId: number,
) => {
    const interest = await AppDataSource.getRepository(ResumeInterest).findOne({
        where: {
            resume_template_id: resumeId,
            id: interestId,
        },
    });
    if (!interest) {
        throw new Error('Interest not found');
    }
    return interest;
};
export const getAllInterestsOfResumeTemplate = async (resumeId: number) => {
    return await AppDataSource.getRepository(ResumeInterest).findBy({
        resume_template_id: resumeId,
    });
};
export const updateInterestOfResumeTemplate = async (
    resumeId: number,
    interestId: number,
    createInterestDTO: createOrUpdateInterestDTO,
) => {
    const interest = await AppDataSource.getRepository(
        ResumeInterest,
    ).findOneBy({
        resume_template_id: resumeId,
        id: interestId,
    });
    if (!interest) {
        throw new Error('Interest not found');
    }
    if (createInterestDTO.interest) {
        interest.interest = createInterestDTO.interest;
    }
    if (createInterestDTO.description) {
        interest.description = createInterestDTO.description;
    }
    return await AppDataSource.getRepository(ResumeInterest).save(interest);
};
export const deleteInterestOfResumeTemplate = async (
    resumeId: number,
    interestId: number,
) => {
    const interest = await AppDataSource.getRepository(
        ResumeInterest,
    ).findOneBy({
        resume_template_id: resumeId,
        id: interestId,
    });
    if (!interest) {
        throw new Error('Interest not found');
    }
    await AppDataSource.getRepository(ResumeInterest).remove(interest);
};
export const createCourseOfResumeTemplate = async (
    resumeId: number,
    createCourseDTO: createOrUpdateCourseDTO,
) => {
    const course = new ResumeCourse();
    course.course = createCourseDTO.course;
    course.institution = createCourseDTO.institution;
    course.city = createCourseDTO.city;
    course.country = createCourseDTO.country;
    course.start_date = createCourseDTO.start_date;
    course.end_date = createCourseDTO.end_date;
    course.is_current = createCourseDTO.is_current;
    course.description = createCourseDTO.description;
    course.resume_template_id = resumeId;
    return await AppDataSource.getRepository(ResumeCourse).save(course);
};
export const getCourseOfResumeTemplate = async (
    resumeId: number,
    courseId: number,
) => {
    const course = await AppDataSource.getRepository(ResumeCourse).findOne({
        where: {
            resume_template_id: resumeId,
            id: courseId,
        },
    });
    if (!course) {
        throw new Error('Course not found');
    }
    return course;
};
export const getAllCoursesOfResumeTemplate = async (resumeId: number) => {
    return await AppDataSource.getRepository(ResumeCourse).findBy({
        resume_template_id: resumeId,
    });
};
export const updateCourseOfResumeTemplate = async (
    resumeId: number,
    courseId: number,
    createCourseDTO: createOrUpdateCourseDTO,
) => {
    const course = await AppDataSource.getRepository(ResumeCourse).findOneBy({
        resume_template_id: resumeId,
        id: courseId,
    });
    if (!course) {
        throw new Error('Course not found');
    }
    if (createCourseDTO.course) {
        course.course = createCourseDTO.course;
    }
    if (createCourseDTO.institution) {
        course.institution = createCourseDTO.institution;
    }
    if (createCourseDTO.city) {
        course.city = createCourseDTO.city;
    }
    if (createCourseDTO.country) {
        course.country = createCourseDTO.country;
    }
    if (createCourseDTO.start_date) {
        course.start_date = createCourseDTO.start_date;
    }
    if (createCourseDTO.end_date) {
        course.end_date = createCourseDTO.end_date;
    }
    if (createCourseDTO.is_current) {
        course.is_current = createCourseDTO.is_current;
    }
    if (createCourseDTO.description) {
        course.description = createCourseDTO.description;
    }
    return await AppDataSource.getRepository(ResumeCourse).save(course);
};
export const deleteCourseOfResumeTemplate = async (
    resumeId: number,
    courseId: number,
) => {
    const course = await AppDataSource.getRepository(ResumeCourse).findOneBy({
        resume_template_id: resumeId,
        id: courseId,
    });
    if (!course) {
        throw new Error('Course not found');
    }
    await AppDataSource.getRepository(ResumeCourse).remove(course);
};
export const createOrganizationOfResumeTemplate = async (
    resumeId: number,
    createOrgDTO: createOrUpdateOrganizationDTO,
) => {
    const organization = new ResumeOrganization();
    organization.organization = createOrgDTO.organization;
    organization.position = createOrgDTO.position;
    organization.city = createOrgDTO.city;
    organization.country = createOrgDTO.country;
    organization.start_date = createOrgDTO.start_date;
    organization.end_date = createOrgDTO.end_date;
    organization.is_current = createOrgDTO.is_current;
    organization.description = createOrgDTO.description;
    organization.resume_template_id = resumeId;
    return await AppDataSource.getRepository(ResumeOrganization).save(
        organization,
    );
};
export const getOrganizationOfResumeTemplate = async (
    resumeId: number,
    orgId: number,
) => {
    const organization = await AppDataSource.getRepository(
        ResumeOrganization,
    ).findOne({
        where: {
            resume_template_id: resumeId,
            id: orgId,
        },
    });
    if (!organization) {
        throw new Error('Organization not found');
    }
    return organization;
};
export const getAllOrganizationsOfResumeTemplate = async (resumeId: number) => {
    return await AppDataSource.getRepository(ResumeOrganization).findBy({
        resume_template_id: resumeId,
    });
};
export const updateOrganizationOfResumeTemplate = async (
    resumeId: number,
    orgId: number,
    createOrgDTO: createOrUpdateOrganizationDTO,
) => {
    const organization = await AppDataSource.getRepository(
        ResumeOrganization,
    ).findOneBy({
        resume_template_id: resumeId,
        id: orgId,
    });
    if (!organization) {
        throw new Error('Organization not found');
    }
    if (createOrgDTO.organization) {
        organization.organization = createOrgDTO.organization;
    }
    if (createOrgDTO.position) {
        organization.position = createOrgDTO.position;
    }
    if (createOrgDTO.city) {
        organization.city = createOrgDTO.city;
    }
    if (createOrgDTO.country) {
        organization.country = createOrgDTO.country;
    }
    if (createOrgDTO.start_date) {
        organization.start_date = createOrgDTO.start_date;
    }
    if (createOrgDTO.end_date) {
        organization.end_date = createOrgDTO.end_date;
    }
    if (createOrgDTO.is_current) {
        organization.is_current = createOrgDTO.is_current;
    }
    if (createOrgDTO.description) {
        organization.description = createOrgDTO.description;
    }
    return await AppDataSource.getRepository(ResumeOrganization).save(
        organization,
    );
};
export const deleteOrganizationOfResumeTemplate = async (
    resumeId: number,
    orgId: number,
) => {
    const organization = await AppDataSource.getRepository(
        ResumeOrganization,
    ).findOneBy({
        resume_template_id: resumeId,
        id: orgId,
    });
    if (!organization) {
        throw new Error('Organization not found');
    }
    await AppDataSource.getRepository(ResumeOrganization).remove(organization);
};
export const createCustomSectionOfResumeTemplate = async (
    resumeId: number,
    createCustomSectionDTO: createOrUpdateCustomSectionDTO,
) => {
    const customSection = new ResumeCustomSection();
    customSection.section_name = createCustomSectionDTO.section_name;
    customSection.title = createCustomSectionDTO.title;
    customSection.subtitle = createCustomSectionDTO.subtitle;
    customSection.city = createCustomSectionDTO.city;
    customSection.country = createCustomSectionDTO.country;
    customSection.start_date = createCustomSectionDTO.start_date;
    customSection.end_date = createCustomSectionDTO.end_date;
    customSection.is_current = createCustomSectionDTO.is_current;
    customSection.description = createCustomSectionDTO.description;
    customSection.resume_template_id = resumeId;
    return await AppDataSource.getRepository(ResumeCustomSection).save(
        customSection,
    );
};
export const getCustomSectionOfResumeTemplate = async (
    resumeId: number,
    customSectionId: number,
) => {
    const customSection = await AppDataSource.getRepository(
        ResumeCustomSection,
    ).findOne({
        where: {
            resume_template_id: resumeId,
            id: customSectionId,
        },
    });
    if (!customSection) {
        throw new Error('Custom Section not found');
    }
    return customSection;
};
export const getAllCustomSectionsOfResumeTemplate = async (
    resumeId: number,
) => {
    return await AppDataSource.getRepository(ResumeCustomSection).findBy({
        resume_template_id: resumeId,
    });
};
export const updateCustomSectionOfResumeTemplate = async (
    resumeId: number,
    customSectionId: number,
    createCustomSectionDTO: createOrUpdateCustomSectionDTO,
) => {
    const customSection = await AppDataSource.getRepository(
        ResumeCustomSection,
    ).findOneBy({
        resume_template_id: resumeId,
        id: customSectionId,
    });
    if (!customSection) {
        throw new Error('Custom Section not found');
    }
    if (createCustomSectionDTO.section_name) {
        customSection.section_name = createCustomSectionDTO.section_name;
    }
    if (createCustomSectionDTO.title) {
        customSection.title = createCustomSectionDTO.title;
    }
    if (createCustomSectionDTO.subtitle) {
        customSection.subtitle = createCustomSectionDTO.subtitle;
    }
    if (createCustomSectionDTO.city) {
        customSection.city = createCustomSectionDTO.city;
    }
    if (createCustomSectionDTO.country) {
        customSection.country = createCustomSectionDTO.country;
    }
    if (createCustomSectionDTO.start_date) {
        customSection.start_date = createCustomSectionDTO.start_date;
    }
    if (createCustomSectionDTO.end_date) {
        customSection.end_date = createCustomSectionDTO.end_date;
    }
    if (createCustomSectionDTO.is_current) {
        customSection.is_current = createCustomSectionDTO.is_current;
    }
    if (createCustomSectionDTO.description) {
        customSection.description = createCustomSectionDTO.description;
    }
    return await AppDataSource.getRepository(ResumeCustomSection).save(
        customSection,
    );
};
export const deleteCustomSectionOfResumeTemplate = async (
    resumeId: number,
    customSectionId: number,
) => {
    const customSection = await AppDataSource.getRepository(
        ResumeCustomSection,
    ).findOneBy({
        resume_template_id: resumeId,
        id: customSectionId,
    });
    if (!customSection) {
        throw new Error('Custom Section not found');
    }
    await AppDataSource.getRepository(ResumeCustomSection).remove(
        customSection,
    );
};
export const createReferenceOfResumeTemplate = async (
    resumeId: number,
    createReferenceDTO: createOrUpdateReferenceDTO,
) => {
    const reference = new ResumeReference();
    reference.name = createReferenceDTO.name;
    reference.job_title = createReferenceDTO.job_title;
    reference.organization = createReferenceDTO.organization;
    reference.email = createReferenceDTO.email;
    reference.phone = createReferenceDTO.phone;
    reference.resume_template_id = resumeId;
    return await AppDataSource.getRepository(ResumeReference).save(reference);
};
export const getReferenceOfResumeTemplate = async (
    resumeId: number,
    referenceId: number,
) => {
    const reference = await AppDataSource.getRepository(
        ResumeReference,
    ).findOne({
        where: {
            resume_template_id: resumeId,
            id: referenceId,
        },
    });
    if (!reference) {
        throw new Error('Reference not found');
    }
    return reference;
};
export const getAllReferencesOfResumeTemplate = async (resumeId: number) => {
    return await AppDataSource.getRepository(ResumeReference).findBy({
        resume_template_id: resumeId,
    });
};
export const updateReferenceOfResumeTemplate = async (
    resumeId: number,
    referenceId: number,
    createReferenceDTO: createOrUpdateReferenceDTO,
) => {
    const reference = await AppDataSource.getRepository(
        ResumeReference,
    ).findOneBy({
        resume_template_id: resumeId,
        id: referenceId,
    });
    if (!reference) {
        throw new Error('Reference not found');
    }
    if (createReferenceDTO.name) {
        reference.name = createReferenceDTO.name;
    }
    if (createReferenceDTO.job_title) {
        reference.job_title = createReferenceDTO.job_title;
    }
    if (createReferenceDTO.organization) {
        reference.organization = createReferenceDTO.organization;
    }
    if (createReferenceDTO.email) {
        reference.email = createReferenceDTO.email;
    }
    if (createReferenceDTO.phone) {
        reference.phone = createReferenceDTO.phone;
    }
    return await AppDataSource.getRepository(ResumeReference).save(reference);
};
export const deleteReferenceOfResumeTemplate = async (
    resumeId: number,
    referenceId: number,
) => {
    const reference = await AppDataSource.getRepository(
        ResumeReference,
    ).findOneBy({
        resume_template_id: resumeId,
        id: referenceId,
    });
    if (!reference) {
        throw new Error('Reference not found');
    }
    await AppDataSource.getRepository(ResumeReference).remove(reference);
};
