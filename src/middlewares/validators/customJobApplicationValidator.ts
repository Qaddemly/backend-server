import { body, param } from 'express-validator';
import { ApplicationQuestionType } from '../../enums/applicationQuestionType';
export const JobIdValidator = [
    param('jobId')
        .notEmpty()
        .withMessage('Job ID is required')
        .isInt()
        .withMessage('Job ID must be a number'),
];
export const CreateCustomJobApplicationValidator = [
    JobIdValidator[0],
    body('questions')
        .isArray({ min: 1 })
        .withMessage('Questions must be an array'),

    body('questions.*.questionText')
        .notEmpty()
        .withMessage('Question text is required')
        .isString()
        .withMessage('Question text must be a string'),
    body('questions.*.questionType')
        .notEmpty()
        .withMessage('questionType is required')
        .isString()
        .withMessage('questionType must be a string')
        .isIn(Object.values(ApplicationQuestionType))
        .withMessage(
            `questionType must be one of: ${Object.values(ApplicationQuestionType).join(', ')}`,
        ),
    body('questions.*.isRequired')
        .optional()
        .isBoolean()
        .withMessage('isRequired must be a boolean'),
    body('questions.*.order')
        .notEmpty()
        .withMessage('Order is required')
        .isInt()
        .withMessage('Order must be a number'),
    body('questions.*.options')
        .optional()
        .isArray()
        .withMessage('Options must be an array')
        .custom((value, { req }) => {
            const questionType = value.questionType;
            if (
                questionType === ApplicationQuestionType.Multiple_Choice &&
                !value
            ) {
                throw new Error(
                    'Options are required for multiple choice questions',
                );
            }
            return true;
        }),

    body('questions').custom((questions) => {
        const seen = new Set();
        if (questions.length !== 0) {
            for (const q of questions) {
                if (seen.has(q.order)) {
                    throw new Error(`Duplicate order value found: ${q.order}`);
                }
                seen.add(q.order);
            }
        }
        return true;
    }),
];
