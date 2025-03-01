import { Address } from '../entity/General/Address';
import { AccountEducation } from '../entity/Account/AccountEducation';
import { AccountExperience } from '../entity/Account/AccountExperience';
import { AccountLanguage } from '../entity/Account/AccountLanguage';
import { Phone } from '../entity/General/Phone';
export const returningExperiences = (experience_: AccountExperience) => {
    const experienceJson = {
        companyName: experience_.company_name,
        employmentType: experience_.employment_type,
        location: experience_.location,
        stillWorking: experience_.still_working,
        locationType: experience_.location_type,
        jobTitle: experience_.job_title,
        startDate: experience_.start_date,
        endDate: experience_.end_date,
    };
    return experienceJson;
};
export const returningEducation = (education_: AccountEducation) => {
    const educationJson = {
        university: education_.university,
        fieldOfStudy: education_.field_of_study,
        gpa: education_.gpa,
        startDate: education_.start_date,
        endDate: education_.end_date,
    };
    return educationJson;
};
export const returningLanguage = (language_: AccountLanguage) => {
    const languageJson = language_.name;
    return languageJson;
};

export const returningFirstName = (first_name: string) => {
    const firstName = first_name;
    return firstName;
};

export const returningLastName = (last_name: string) => {
    const lastName = last_name;
    return lastName;
};

export const returningDateOfBirth = (date_of_birth: Date) => {
    const dateOfBirth = date_of_birth;
    return dateOfBirth;
};

export const returningPhone = (phone: Phone) => {
    const phone_ = {
        countryCode: phone.country_code,
        number: phone.number,
    };
    return phone_;
};
