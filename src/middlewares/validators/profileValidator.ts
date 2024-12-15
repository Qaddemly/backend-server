import { body, param, ValidationChain } from 'express-validator';

import { EmploymentType } from '../../enums/employmentType';
import { LocationType } from '../../enums/locationType';

export const updateUserOneExperienceValidator: ValidationChain[] = [
    param('id').isInt().withMessage('id must be an integer'),
    body('jobTitle')
        .optional()
        .isString()
        .withMessage('jobTitle must be a string')
        .notEmpty()
        .withMessage('Job Title required'),
    body('companyName')
        .optional()
        .isString()
        .withMessage('CompanyName must be string')
        .notEmpty()
        .withMessage('Job Title required'),
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
    body('stillWorking').custom((val, { req }) => {
        if (typeof val !== 'boolean') {
            throw new Error('Still working must be a boolean');
        }
        if (req.body.endDate && val == true) {
            throw new Error('you cant add still working with endDate');
        }
        return true;
    }),
    body('startDate')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),
    body('endDate')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date'),
];

export const createUserOneExperienceValidator: ValidationChain[] = [
    body('jobTitle')
        .isString()
        .withMessage('jobTitle must be a string')
        .notEmpty()
        .withMessage('Job Title required'),
    body('companyName')
        .isString()
        .withMessage('CompanyName must be string')
        .notEmpty()
        .withMessage('Job Title required'),
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
    body('stillWorking')
        .exists()
        .withMessage('still working is required')
        .custom((val, { req }) => {
            if (typeof val !== 'boolean') {
                throw new Error('Still working must be a boolean');
            }
            if (req.body.endDate && val == true) {
                throw new Error('you cant add still working with endDate');
            }
            return true;
        }),
    body('startDate')
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),
    body('endDate')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date'),
];

export const deleteUserOneExperienceValidator: ValidationChain[] = [
    param('id').isInt().withMessage('id must be an integer'),
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
