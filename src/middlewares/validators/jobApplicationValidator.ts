import { body, param, query } from 'express-validator';
import { ApplicationQuestionType } from '../../enums/applicationQuestionType';
import mongoose from 'mongoose';
import { EmploymentType } from '../../enums/employmentType';
import { LocationType } from '../../enums/locationType';
import { JobApplicationStateEnum } from '../../enums/jobApplicationStateEnum';
import { ApplicationQuestionModel } from '../../models/jobApplicationQuestion';
import { ApplicationQuestionsModel } from '../../models/jobApplicationQuestions';
import { CountryCode } from '../../enums/countryCode';
export const JobIdValidator = [
    param('jobId')
        .notEmpty()
        .withMessage('Job ID is required')
        .isInt()
        .withMessage('Job ID must be a number'),
];

export const jobApplicationFormIdValidator = [
    param('jobApplicationFormId')
        .notEmpty()
        .withMessage('jobApplicationFormId is required')
        .isInt()
        .withMessage('jobApplicationFormId must be a number'),
];

export const jobApplicationIdValidator = [
    param('jobApplicationId')
        .notEmpty()
        .withMessage('jobApplicationId is required')
        .isInt()
        .withMessage('jobApplicationId must be a number'),
];

export const getOneJobApplicationByBusinessValidator = [
    JobIdValidator[0],
    jobApplicationIdValidator[0],
];

export const getAccountOneJobApplicationValidator = [
    jobApplicationIdValidator[0],
];

export const updateJobApplicationFormStateValidator = [
    JobIdValidator[0],
    jobApplicationIdValidator[0],
    body('state')
        .notEmpty()
        .withMessage('State is required')
        .isIn(Object.values(JobApplicationStateEnum))
        .withMessage(
            `Invalid state. Must be one of: ${Object.values(JobApplicationStateEnum).join(', ')}`,
        ),
];
export const CreateJobApplicationFormValidator = [
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

export const CreateJobApplicationValidator = [
    JobIdValidator[0],
    body('personalInfo')
        .custom((value) => typeof value === 'object' && value !== null)
        .withMessage('personalInfo must be a non-null object'),
    body('personalInfo.first_name')
        .notEmpty()
        .withMessage('First name is required')
        .isString()
        .withMessage('first name must be string'),
    body('personalInfo.last_name')
        .notEmpty()
        .withMessage('Last name is required')
        .isString()
        .withMessage('last name must be string'),
    body('personalInfo.email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('A valid email is required'),
    body('personalInfo.phone').exists().isObject(),
    body('personalInfo.phone.country_code')
        .if(body('personalInfo.phone').exists())
        .notEmpty()
        .withMessage('Country code cannot be empty')
        .custom((value) => {
            if (value in CountryCode) return value;
            else throw new Error('Invalid country code');
        }),
    body('personalInfo.phone.number')
        .if(body('personalInfo.phone').exists())
        .notEmpty()
        .withMessage('Phone number cannot be empty')
        .isNumeric()
        .withMessage('Phone number must be numeric'),
    body('personalInfo.birth_date')
        .notEmpty()
        .withMessage('birth_date is required')
        .isDate()
        .withMessage('Birth date must be a valid date'),
    // // EDUCATIONS
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
    body('experiences.*.description')
        .optional()
        .isString()
        .notEmpty()
        .withMessage('Description is required'),
    body('experiences.*.employmentType')
        .isString()
        .notEmpty()
        .withMessage('Employment type is required')
        .custom((value) => {
            if (value in EmploymentType) return value;
            else throw new Error('Invalid employment type');
        }),
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
        .custom((value) => {
            if (value in LocationType) return value;
            else throw new Error('Invalid location type');
        })
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
    body('answers')
        .isArray({ min: 1 })
        .withMessage('answers must be a non-empty array'),
    body('answers.*.question._id')
        .notEmpty()
        .withMessage('question._id is required')
        .isString()
        .withMessage('question._id must be a string'),

    body('answers.*.question.questionText')
        .notEmpty()
        .withMessage('questionText is required')
        .isString()
        .withMessage('questionText must be a string'),

    body('answers.*.question.questionType')
        .notEmpty()
        .withMessage('questionType is required')
        .isIn(Object.values(ApplicationQuestionType))
        .withMessage(
            `questionType must be one of: ${Object.values(ApplicationQuestionType).join(', ')}`,
        ),

    body('answers.*.question.isRequired')
        .isBoolean()
        .withMessage('isRequired must be a boolean'),

    body('answers.*.question.options')
        .optional()
        .isArray()
        .withMessage('options must be an array of strings')
        .custom((arr) => arr.every((opt: any) => typeof opt === 'string'))
        .withMessage('Each option must be a string'),

    body('answers.*.answer')
        .optional()
        .notEmpty()
        .withMessage('answer is required'),

    // Custom validator that fetches questions from DB and validates each answer
    body('answers').custom(async (submittedAnswers, { req }) => {
        const params = req.params;
        const jobId = params.jobId;
        console.log('jobId', jobId);

        const application = await ApplicationQuestionsModel.findOne({ jobId });
        if (!application) {
            throw new Error(`No application found for jobId: ${jobId}`);
        }

        const storedQuestions = application.questions;

        for (const submitted of submittedAnswers) {
            const { question, answer } = submitted;

            if (!question || !question?._id) {
                throw new Error(
                    `Each answer must include a valid question with _id`,
                );
            }

            // Find matching question by ID
            const stored = storedQuestions.find(
                (q) => q._id.toString() == question?._id.toString(),
            );
            if (!stored) {
                throw new Error(
                    `Question with ID ${question?._id} not found in job questions`,
                );
            }

            // Check that all fields match exactly
            const normalizeOptions = (options?: string[]) =>
                Array.isArray(options) ? options.sort() : [];

            const parseBoolean = (val: any) => val === 'true' || val === true;

            const fieldsMatch =
                stored.questionText === question?.questionText &&
                stored.questionType === question?.questionType &&
                stored.isRequired === parseBoolean(question?.isRequired) &&
                JSON.stringify(normalizeOptions(stored.options)) ===
                    JSON.stringify(normalizeOptions(question?.options));

            if (!fieldsMatch) {
                throw new Error(
                    `Submitted question does not match stored question for ID ${question?._id}`,
                );
            }

            // Optionally: Validate answer if required or multiple_answers
            if (stored.isRequired && (!answer || answer.length === 0)) {
                throw new Error(
                    `Answer is required for question: ${stored.questionText}`,
                );
            }

            if (
                stored?.questionType ===
                    ApplicationQuestionType.Multiple_Choice &&
                stored?.options &&
                stored?.options.length > 0
            ) {
                const selected = Array.isArray(answer) ? answer : [answer];
                const invalid = selected.filter(
                    (ans) => !stored.options.includes(ans),
                );
                if (invalid.length > 0) {
                    throw new Error(
                        `Invalid option(s) for question: ${stored.questionText} → ${invalid.join(', ')}`,
                    );
                }
            }
        }

        return true;
    }),
];

export const updateJobQuestionsValidator = [
    JobIdValidator[0],

    body('questions')
        .optional()
        .isArray()
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
    body('questions.*._id')
        .optional()
        .isMongoId()
        .withMessage('_id must be a valid mongodb Id'),
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
];

export const questionIdValidator = [
    param('questionId')
        .notEmpty()
        .withMessage('Question ID is required')
        .isMongoId()
        .withMessage('Question ID must be a valid MongoDB ObjectId'),
];

export const updateQuestionToJobApplicationFormValidator = [
    jobApplicationFormIdValidator[0],
    questionIdValidator[0],
    body('questionText')
        .optional()
        .isString()
        .withMessage('Question text must be a string'),
    body('questionType')
        .optional()
        .isString()
        .withMessage('questionType must be a string')
        .isIn(Object.values(ApplicationQuestionType))
        .withMessage(
            `questionType must be one of: ${Object.values(ApplicationQuestionType).join(', ')}`,
        ),
    body('isRequired')
        .optional()
        .isBoolean()
        .withMessage('isRequired must be a boolean'),
    body('order')
        .optional()
        .isInt()
        .withMessage('Order must be a number')
        .custom(async (value, { req }) => {
            const questions = await ApplicationQuestionModel.find({
                jobApplicationFormId: req.params.jobApplicationFormId,
            }).sort({ order: 1 });
            const questionOrders = questions.map((question) => question.order);
            if (questionOrders.includes(value)) {
                throw new Error(
                    `${questionOrders} already exists in the job application form`,
                );
            }
            return true;
        }),
    body('options')
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
];

export const deleteQuestionToJobApplicationFormValidator = [
    jobApplicationFormIdValidator[0],
    questionIdValidator[0],
];

export const archiveJobApplicationValidator = [
    jobApplicationIdValidator[0],
    query('archive')
        .notEmpty()
        .withMessage('archive is required')
        .isBoolean()
        .withMessage('archive must be a boolean'),
];
