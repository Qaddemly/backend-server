import mongoose from 'mongoose';

export interface IApplicationQuestion {
    questionText: string; // The question text
    questionType: string; // The type of question (e.g., text, multiple choice, etc.)
    options?: string[]; // Options for multiple choice questions
    isRequired: boolean; // Whether the question is required or not
    order: number; // The order of the question in the application form
    jobId: number; // The ID of the job this question is associated with
    jobApplicationFormId: number; // The ID of the custom job application this question is associated with
}

const ApplicationQuestionSchema = new mongoose.Schema<IApplicationQuestion>(
    {
        questionText: { type: String, required: true },
        questionType: { type: String, required: true },
        options: { type: [String], required: false, default: undefined },
        isRequired: { type: Boolean, default: false },
        order: { type: Number, required: true },
        jobId: { type: Number, required: true },
        jobApplicationFormId: { type: Number, required: true },
    },
    { timestamps: true },
);

export const ApplicationQuestionModel = mongoose.model<IApplicationQuestion>(
    'ApplicationQuestion',
    ApplicationQuestionSchema,
);
