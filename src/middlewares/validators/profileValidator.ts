import { body, param, ValidationChain } from 'express-validator';

import { EmploymentType } from '../../enums/employmentType';
import { LocationType } from '../../enums/locationType';
import { Language } from '../../enums/language';
import { CountryCode } from '../../enums/countryCode';
import { Country } from '../../enums/country';
import { AccountRepository } from '../../Repository/accountRepository';

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

export const updateUserOneEducationValidator: ValidationChain[] = [
    body('university')
        .optional()
        .isString()
        .withMessage('university must be a string')
        .trim()
        .notEmpty()
        .withMessage('University name cannot be empty'),
    body('fieldOfStudy')
        .optional()
        .isString()
        .withMessage('university must be a string')
        .trim()
        .notEmpty()
        .withMessage('Field of study cannot be empty'),
    body('gpa')
        .optional()
        .notEmpty()
        .withMessage('GPA cannot be empty')
        .isNumeric()
        .withMessage('GPA must be a number')
        .custom((value) => {
            if (value >= 0 && value <= 4) return value;
            else throw new Error('GPA must be between 0 and 4');
        }),
    body('start_date')
        .optional()
        .isDate()
        .withMessage('Invalid start date')
        .custom((val, { req }) => {
            if (val >= req.body.end_date) {
                throw new Error('Start date must be less than end date');
            } else return val;
        }),
    body('end_date')
        .optional()
        .isDate()
        .withMessage('Invalid end date')
        .custom((val, { req }) => {
            if (val <= req.body.start_date) {
                throw new Error('Start date must be less than end date');
            } else return val;
        }),
];

export const createUserOneEducationValidator: ValidationChain[] = [
    body('university')
        .isString()
        .withMessage('university must be a string')
        .trim()
        .notEmpty()
        .withMessage('University name cannot be empty'),
    body('field_of_study')
        .isString()
        .withMessage('field of study must be a string')
        .trim()
        .notEmpty()
        .withMessage('Field of study cannot be empty'),
    body('gpa')
        .notEmpty()
        .withMessage('GPA cannot be empty')
        .isNumeric()
        .withMessage('GPA must be a number')
        .custom((value) => {
            if (value >= 0 && value <= 4) return value;
            else throw new Error('GPA must be between 0 and 4');
        }),
    body('start_date')
        .isDate()
        .withMessage('Invalid start date')
        .custom((val, { req }) => {
            if (val >= req.body.end_date) {
                throw new Error('Start date must be less than end date');
            } else return val;
        }),
    body('end_date')
        .isDate()
        .withMessage('Invalid end date')
        .custom((val, { req }) => {
            if (val <= req.body.start_date) {
                throw new Error('Start date must be less than end date');
            } else return val;
        }),
];

export const updateUserBasicInfoValidator: ValidationChain[] = [
    body('email')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .toLowerCase()
        .custom(async (val) => {
            const user = await AccountRepository.findOneBy({ email: val });
            if (!user) {
                return true;
            } else {
                throw new Error('Email already exists');
            }
        }),
    body('first_name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isAlpha()
        .withMessage('First name must be a string of alphabets'),
    body('last_name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isAlpha()
        .withMessage('Last name must be a string of alphabets'),
    body('profile_picture')
        .optional()
        .notEmpty()
        .withMessage('profile_picture cannot be empty')
        .isString()
        .withMessage('profile_picture must be a string'),

    body('date_of_birth')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid date of birth'),
    body('phone').optional().isObject(),
    body('phone.countryCode')
        .if(body('phone').exists())
        .notEmpty()
        .withMessage('Country code cannot be empty')
        .custom((value) => {
            if (value in CountryCode) return value;
            else throw new Error('Invalid country code');
        }),
    body('phone.number')
        .if(body('phone').exists())
        .notEmpty()
        .withMessage('Phone number cannot be empty')
        .isNumeric()
        .withMessage('Phone number must be numeric'),
    body('address').optional().isObject(),
    body('address.country')
        .if(body('address').exists())
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
];
