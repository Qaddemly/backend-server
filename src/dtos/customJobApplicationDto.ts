export interface CreateCustomJobApplicationDto {
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
