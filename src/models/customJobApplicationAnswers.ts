import mongoose from 'mongoose';

export interface IApplicationQuestionAnswer {
    questionId: mongoose.Types.ObjectId; // The ID of the question this answer is associated with
    accountId: number; // The ID of the account this answer is associated with
    customJobApplicationSubmitId: number; // The ID of the custom job application this answer is associated with
    answer: string; // The answer to the question
}

const ApplicationQuestionAnswerSchema =
    new mongoose.Schema<IApplicationQuestionAnswer>(
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'ApplicationQuestion', // Reference to the ApplicationQuestion model
            },
            accountId: { type: Number, required: true },
            customJobApplicationSubmitId: { type: Number, required: true },
            answer: { type: String, required: true },
        },
        { timestamps: true },
    );

export const ApplicationAnswerModel =
    mongoose.model<IApplicationQuestionAnswer>(
        'ApplicationQuestionAnswer',
        ApplicationQuestionAnswerSchema,
    );
