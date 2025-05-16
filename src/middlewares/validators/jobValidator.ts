import { body, param, ValidationChain } from 'express-validator';

import { EmploymentType } from '../../enums/employmentType';
import { LocationType } from '../../enums/locationType';
import { Language } from '../../enums/language';
import { Country } from '../../enums/country';
import { ApplicationQuestionType } from '../../enums/applicationQuestionType';

export const createJobValidator: ValidationChain[] = [
    body('business_id')
        .notEmpty()
        .withMessage('business_id required')
        .isNumeric()
        .withMessage('in valid business_id'),
    body('title')
        .isString()
        .withMessage('title must be a string')
        .notEmpty()
        .withMessage('title required'),
    body('description')
        .isString()
        .withMessage('description must be string')
        .notEmpty()
        .withMessage('description required')
        .isLength({ min: 20 })
        .withMessage('description must be at least 20 characters'),
    body('employee_type')
        .notEmpty()
        .withMessage('Employment type cannot be empty')
        .custom((value) => {
            if (value in EmploymentType) return value;
            else throw new Error('Invalid employment type');
        }),

    body('country')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('country cannot be empty')
        .custom((value) => {
            if (value in Country) return value;
            else throw new Error('Invalid country');
        }),
    body('city')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('city cannot be empty')
        .isString(),
    body('location_type')
        .trim()
        .notEmpty()
        .withMessage('Location type cannot be empty')
        .custom((value) => {
            if (value in LocationType) return value;
            else throw new Error('Invalid location type');
        }),

    body('salary')
        .notEmpty()
        .withMessage('salary required')
        .isNumeric()
        .withMessage('in valid salary')
        .custom((value) => {
            if (value > 0) return value;
            else throw new Error('invalid salary');
        }),
    body('keywords').isArray().withMessage('in valid keywords'),
    body('skills').isArray().withMessage('in valid skills'),
    body('has_extra_link_application')
        .notEmpty()
        .withMessage('has_extra_link_application required')
        .isBoolean()
        .withMessage('has_extra_link_application must be a boolean')
        .custom((value, { req }) => {
            // if (
            //     value === false &&
            //     (!req.body.questions || req.body.questions.length === 0)
            // ) {
            //     throw new Error(
            //         'extra_application_link must true With Extra link when there is no questions',
            //     );
            // }
            if (
                value === true &&
                req.body.questions &&
                req.body.questions.length > 0
            ) {
                throw new Error(
                    'extra_application_link is not required when there are questions',
                );
            }
            return true;
        }),
    body('extra_application_link').custom((value, { req }) => {
        if (req.body.has_extra_link_application === true && !value) {
            throw new Error(
                'extra_application_link is required when has_extra_link_application is true',
            );
        }
        if (req.body.has_extra_link_application === false && value) {
            throw new Error(
                'extra_application_link is not required when has_extra_link_application is false',
            );
        }
        return true;
    }),
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
    // If the body has no questions, then extra_application_link is required

    body('questions.*.isRequired')
        .optional()
        .isBoolean()
        .withMessage('isRequired must be a boolean'),

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

export const updateJobValidator: ValidationChain[] = [
    body('title')
        .optional()
        .isString()
        .withMessage('title must be a string')
        .notEmpty()
        .withMessage('title required'),
    body('description')
        .optional()
        .isString()
        .withMessage('description must be string')
        .notEmpty()
        .withMessage('description required')
        .isLength({ min: 20 })
        .withMessage('description must be at least 20 characters'),
    body('employee_type')
        .optional()
        .notEmpty()
        .withMessage('Employment type cannot be empty')
        .custom((value) => {
            if (value in EmploymentType) return value;
            else throw new Error('Invalid employment type');
        }),

    body('country')
        .optional()
        .trim()
        .custom((value) => {
            if (value in Country) return value;
            else throw new Error('Invalid country');
        }),
    body('city')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('city cannot be empty')
        .isString(),
    body('location_type')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Location type cannot be empty')
        .custom((value) => {
            if (value in LocationType) return value;
            else throw new Error('Invalid location type');
        }),

    body('salary')
        .optional()
        .notEmpty()
        .withMessage('salary required')
        .isNumeric()
        .withMessage('in valid salary'),
    body('keywords').optional().isArray().withMessage('in valid keywords'),
    body('skills').isArray().optional().withMessage('in valid skills'),
];

export const idJobValidator: ValidationChain[] = [
    param('id').isInt().withMessage('id must be an integer'),
];

export const applyToJobValidator: ValidationChain[] = [
    body('resume_id')
        .optional()
        .isInt()
        .withMessage('resume_id must be an integer'),
];
export const createUserOneSkillValidator: ValidationChain[] = [
    body('name')
        .isString()
        .withMessage('name must be a string')
        .notEmpty()
        .withMessage('name required'),
];

export const deleteUserOneSkillValidator: ValidationChain[] = [
    param('id').isInt().withMessage('id must be an integer'),
];

export const createUserOneLanguageValidator: ValidationChain[] = [
    body('name')
        .isString()
        .withMessage('name must be a string')
        .notEmpty()
        .withMessage('name required')
        .custom((value) => {
            if (value in Language) return value;
            else throw new Error('Invalid language');
        }),
];

export const deleteUserOneLanguageValidator: ValidationChain[] = [
    param('id').isInt().withMessage('id must be an integer'),
];
