import { body, checkSchema, param } from 'express-validator';
import { ApplicationQuestionType } from '../../enums/applicationQuestionType';
import mongoose from 'mongoose';
import { ApplicationQuestionModel } from '../../models/customJobApplicationQuestion';
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

export const CreateCustomJobApplicationSubmitValidator = [
    body('personalInfo')
        .notEmpty()
        .withMessage('Personal information is required'),
    body('personalInfo.first_name')
        .isString()
        .notEmpty()
        .withMessage('First name is required'),
    body('personalInfo.last_name')
        .isString()
        .notEmpty()
        .withMessage('Last name is required'),
    body('personalInfo.email')
        .isEmail()
        .withMessage('A valid email is required'),
    body('personalInfo.phone')
        .isMobilePhone('any')
        .withMessage('A valid phone number is required'),
    body('personalInfo.birth_date')
        .isDate()
        .withMessage('Birth date must be a valid date'),
    // EDUCATIONS
    body('educations').isArray().withMessage('Educations must be an array'),
    body('educations.*.university')
        .isString()
        .notEmpty()
        .withMessage('University is required'),
    body('educations.*.fieldOfStudy')
        .isString()
        .notEmpty()
        .withMessage('Field of study is required'),
    body('educations.*.gpa')
        .isFloat({ min: 0, max: 4 })
        .withMessage('GPA must be between 0 and 4'),
    body('educations.*.startDate')
        .isISO8601()
        .toDate()
        .withMessage('Start date must be a valid date'),
    body('educations.*.endDate')
        .isISO8601()
        .toDate()
        .withMessage('End date must be a valid date'),

    // EXPERIENCES
    body('experiences').isArray().withMessage('Experiences must be an array'),
    body('experiences.*.jobTitle')
        .isString()
        .notEmpty()
        .withMessage('Job title is required'),
    body('experiences.*.employmentType')
        .isString()
        .notEmpty()
        .withMessage('Employment type is required'),
    body('experiences.*.companyName')
        .isString()
        .notEmpty()
        .withMessage('Company name is required'),
    body('experiences.*.location')
        .isString()
        .notEmpty()
        .withMessage('Location is required'),
    body('experiences.*.locationType')
        .isString()
        .notEmpty()
        .withMessage('Location type is required'),
    body('experiences.*.stillWorking')
        .isBoolean()
        .withMessage('stillWorking must be a boolean'),
    body('experiences.*.startDate')
        .isISO8601()
        .toDate()
        .withMessage('Start date must be a valid date'),
    body('experiences.*.endDate')
        .optional({ nullable: true })
        .isISO8601()
        .toDate()
        .withMessage('End date must be a valid date if provided'),

    // SKILLS
    body('skills').isArray().withMessage('Skills must be an array'),
    body('skills.*')
        .isString()
        .notEmpty()
        .withMessage('Each skill must be a non-empty string'),

    // LANGUAGES
    body('languages').isArray().withMessage('Languages must be an array'),
    body('languages.*')
        .isString()
        .notEmpty()
        .withMessage('Each language must be a non-empty string'),

    // ANSWERS BASIC VALIDATION
    body('answers').isArray().withMessage('Answers must be an array'),
    body('answers.*.questionId')
        .custom((value) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('Each questionId must be a valid MongoDB ObjectId'),
    body('answers.*.answer')
        .isString()
        .withMessage('Each answer must be a string'),

    // ANSWERS CUSTOM VALIDATION BASED ON QUESTION TYPE
    body('answers').custom(async (answers) => {
        for (const ans of answers) {
            const question = await ApplicationQuestionModel.findById(
                ans.questionId,
            );

            if (!question) {
                throw new Error(`Question not found for ID ${ans.questionId}`);
            }

            // Required check
            if (
                question.isRequired &&
                (!ans.answer || ans.answer.trim() === '')
            ) {
                throw new Error(
                    `Answer is required for question "${question.questionText}"`,
                );
            }

            // Multiple choice validation
            if (
                question.questionType === 'multiple_choice' &&
                (!question.options || !question.options.includes(ans.answer))
            ) {
                throw new Error(
                    `Answer "${ans.answer}" is not a valid option for question "${question.questionText}"`,
                );
            }
        }

        return true;
    }),
];
