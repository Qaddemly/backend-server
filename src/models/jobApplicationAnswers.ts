import mongoose from 'mongoose';

export interface IApplicationQuestionAnswer {
    question: mongoose.Types.ObjectId; // The ID of the question this answer is associated with
    accountId: number; // The ID of the account this answer is associated with
    jobApplicationFormId: number; // The ID of the custom job application this answer is associated with
    answer: string; // The answer to the question
    jobApplicationId: number; // The ID of the custom job application this question is associated with
}

const ApplicationQuestionAnswerSchema =
    new mongoose.Schema<IApplicationQuestionAnswer>(
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'ApplicationQuestion', // Reference to the ApplicationQuestion model
            },
            accountId: { type: Number, required: true },
            jobApplicationFormId: { type: Number, required: true },
            answer: { type: String, required: true },
            jobApplicationId: { type: Number, required: true },
        },
        { timestamps: true },
    );

export const ApplicationAnswerModel =
    mongoose.model<IApplicationQuestionAnswer>(
        'ApplicationQuestionAnswer',
        ApplicationQuestionAnswerSchema,
    );
