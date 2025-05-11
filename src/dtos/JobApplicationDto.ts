import { Types } from 'mongoose';
import { Education, Experience, ResumeType } from '../types/types';

export interface CreateJobApplicationFormDto {
    questions: {
        questionText: string; // The question text
        questionType: string; // The type of question (e.g., text, multiple choice, etc.)
        options?: string[]; // Options for multiple choice questions
        isRequired: boolean; // Whether the question is required or not
        order: number; // The order of the question in the application form
    }[];
    // is_education_required?: boolean; // Indicates if education is required for the job
    // is_experience_required?: boolean; // Indicates if experience is required for the job
    // is_skills_required?: boolean; // Indicates if skills are required for the job
    // is_languages_required?: boolean; // Indicates if language is required for the job
}

export interface CreateJobApplicationDto {
    personalInfo: {
        first_name: string; // First name of the applicant
        last_name: string; // Last name of the applicant
        email: string; // Email address of the applicant
        phone: string; // Phone number of the applicant
        birth_date: Date; // Birth date of the applicant
    };
    educations: Education[];
    experiences: Experience[];
    resume: ResumeType;
    skills: string[];
    languages: string[];
    answers: {
        question: {
            _id: string;
            questionText: string; // The question text
            questionType: string; // The type of question (e.g., text, multiple choice, etc.)
            options?: string[]; // Options for multiple choice questions
            isRequired: boolean;
        };
        answer: string;
    }[];
}

export interface CreateJobApplicationFormQuestionDto {
    questionText: string; // The question text
    questionType: string; // The type of question (e.g., text, multiple choice, etc.)
    options?: string[]; // Options for multiple choice questions
    isRequired: boolean; // Whether the question is required or not
}

export interface UpdateJobApplicationFormQuestionDto {
    questionText?: string; // The question text
    questionType?: string; // The type of question (e.g., text, multiple choice, etc.)
    options?: string[]; // Options for multiple choice questions
    isRequired?: boolean; // Whether the question is required or not
    order?: number; // The order of the question in the application form
}
