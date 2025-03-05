import { LanguageLevel } from '../enums/languageLevel';

export interface createOrUpdateResumeExperienceDTO {
    job_title?: string;
    company_name?: string;
    city?: string;
    country?: string;
    start_date?: Date;
    end_date?: Date;
    is_current?: boolean;
    description?: string;
}
export interface createOrUpdateLanguageDTO {
    language?: string;
    additional_info?: string;
    level?: LanguageLevel;
}
export interface createOrUpdateInterestDTO {
    interest?: string;
    description?: string;
}
export interface createOrUpdateCourseDTO {
    course?: string;
    institution?: string;
    city?: string;
    country?: string;
    start_date?: Date;
    end_date?: Date;
    is_current?: boolean;
    description?: string;
}
export interface createOrUpdateOrganizationDTO {
    organization?: string;
    position?: string;
    city?: string;
    country?: string;
    start_date?: Date;
    end_date?: Date;
    is_current?: boolean;
    description?: string;
}
export interface createOrUpdateCustomSectionDTO {
    section_name?: string;
    title?: string;
    subtitle?: string;
    city?: string;
    country?: string;
    start_date?: Date;
    end_date?: Date;
    is_current?: boolean;
    description?: string;
}
export interface createOrUpdateReferenceDTO {
    name?: string;
    job_title?: string;
    organization?: string;
    email?: string;
    phone?: string;
}
