import { body, param, ValidationChain } from 'express-validator';

import { EmploymentType } from '../../enums/employmentType';
import { LocationType } from '../../enums/locationType';
import { Language } from '../../enums/language';

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
    body('employmentType')
        .notEmpty()
        .withMessage('Employment type cannot be empty')
        .custom((value) => {
            if (value in EmploymentType) return value;
            else throw new Error('Invalid employment type');
        }),

    body('location')
        .isString()
        .withMessage('location must be string')
        .trim()
        .notEmpty()
        .withMessage('Location cannot be empty'),
    body('locationType')
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
        .withMessage('in valid salary'),
    body('keywords').isArray().withMessage('in valid keywords'),
    body('skills').isArray().withMessage('in valid skills'),
];

export const updateJobValidator: ValidationChain[] = [
    body('business_id')
        .notEmpty()
        .withMessage('business_id required')
        .isNumeric()
        .withMessage('in valid business_id'),
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
    body('employmentType')
        .optional()
        .notEmpty()
        .withMessage('Employment type cannot be empty')
        .custom((value) => {
            if (value in EmploymentType) return value;
            else throw new Error('Invalid employment type');
        }),

    body('location')
        .optional()
        .isString()
        .withMessage('location must be string')
        .trim()
        .notEmpty()
        .withMessage('Location cannot be empty'),
    body('locationType')
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
        .notEmpty()
        .withMessage('resume_id required')
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
