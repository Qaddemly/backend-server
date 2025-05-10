import mongoose, { SchemaTypes } from 'mongoose';

export interface IApplicationQuestionAnswer {
    question: mongoose.Types.ObjectId; // The ID of the question this answer is associated with
    accountId: number; // The ID of the account this answer is associated with
    jobApplicationFormId: number; // The ID of the custom job application this answer is associated with
    answer: string; // The answer to the question
    jobApplicationId: number; // The ID of the custom job application this question is associated with
}

const ApplicationQuestionAnswerSchema = new mongoose.Schema(
    {
        accountId: { type: Number, required: true },
        jobId: { type: Number, required: true },
        jobApplicationId: { type: Number, required: true },
        answers: [
            {
                question: {
                    _id: SchemaTypes.ObjectId,
                    questionText: { type: String, required: true },
                    questionType: { type: String, required: true },
                    options: {
                        type: [String],
                        required: false,
                        default: undefined,
                    },
                    isRequired: { type: Boolean, default: false },
                },
                answer: String,
            },
        ],
    },
    { timestamps: true },
);

export const ApplicationAnswersModel = mongoose.model(
    'ApplicationQuestionAnswerss',
    ApplicationQuestionAnswerSchema,
);
