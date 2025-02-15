import { body, param, ValidationChain } from 'express-validator';

import { EmploymentType } from '../../enums/employmentType';
import { LocationType } from '../../enums/locationType';
import { Language } from '../../enums/language';
import { Country } from '../../enums/country';

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

    body('location').optional().isObject(),
    body('location.country')
        .if(body('location').exists())
        .trim()
        .notEmpty()
        .withMessage('Country cannot be empty')
        .custom((value) => {
            if (value in Country) return value;
            else
                throw new Error(
                    'Country Name is invalid (not in the country list)',
                );
        }),
    body('address.city')
        .if(body('address').exists())
        .trim()
        .notEmpty()
        .withMessage('City cannot be empty')
        .isAlpha()
        .withMessage('City must be a string of alphabets'),
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

    body('location')
        .optional()
        .isString()
        .withMessage('location must be string')
        .trim()
        .notEmpty()
        .withMessage('Location cannot be empty'),
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
