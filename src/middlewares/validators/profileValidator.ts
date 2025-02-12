import { body, param, ValidationChain } from 'express-validator';

import { EmploymentType } from '../../enums/employmentType';
import { LocationType } from '../../enums/locationType';
import { Language } from '../../enums/language';
import { CountryCode } from '../../enums/countryCode';
import { Country } from '../../enums/country';
import { AccountRepository } from '../../Repository/accountRepository';

export const idValidator: ValidationChain[] = [
    param('id').isInt().withMessage('id must be an integer'),
];
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

export const deleteUserOneResumeValidator: ValidationChain[] = [
    param('id').isInt().withMessage('id must be an integer'),
];

export const createUserOneResumeValidator: ValidationChain[] = [
    body('resumes')
        .notEmpty()
        .withMessage('resumes is required')
        .isString()
        .withMessage('resume must be string'),
];
export const createUserOneSkillValidator: ValidationChain[] = [
    body('skills')
        .isArray({ min: 1 }) // Ensure 'skills' is an array and not empty
        .withMessage('Skills must be a non-empty array'),

    body('skills.*')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Each skill must be a non-empty string'),
];

export const deleteUserOneSkillValidator: ValidationChain[] = [
    body('skillsId')
        .isArray({ min: 1 }) // Ensure 'skills' is an array and not empty
        .withMessage('Skills must be a non-empty array'),

    body('skillsId.*')
        .isInt()
        .trim()
        .notEmpty()
        .withMessage('Each skill must be a non-empty interger'),
];

export const createUserOneLanguageValidator: ValidationChain[] = [
    body('languages')
        .isArray({ min: 1 }) // Ensure 'languages' is an array and not empty
        .withMessage('languages must be a non-empty array'),

    body('languages.*')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Each language must be a non-empty string')
        .custom((lang) => {
            if (lang in Language) {
                return lang;
            } else throw new Error('Invalid language');
        }),
];

export const deleteUserOneLanguageValidator: ValidationChain[] = [
    body('languagesId')
        .isArray({ min: 1 }) // Ensure 'skills' is an array and not empty
        .withMessage('languagesId must be a non-empty array'),

    body('languagesId.*')
        .isInt()
        .trim()
        .notEmpty()
        .withMessage('Each LanguagesId must be a non-empty interger'),
];

export const updateUserOneEducationValidator: ValidationChain[] = [
    param('id').isInt().withMessage('id must be an integer'),
    body('university')
        .optional()
        .isString()
        .withMessage('university must be a string')
        .trim()
        .notEmpty()
        .withMessage('University name cannot be empty'),
    body('field_of_study')
        .optional()
        .isString()
        .withMessage('field_of_study must be a string')
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
    body('phone.country_code')
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
    body('links')
        .optional({ nullable: true })
        .isArray({ min: 0 })
        .withMessage('links must be an array of strings'),
    body('links.*')
        .optional()
        .isURL()
        .withMessage('Each link must be a valid URL')
        .trim(),
    body('about_me')
        .optional({ nullable: true })
        .isString()
        .withMessage('about_me must be a string'),
    body('subtitle')
        .optional({ nullable: true })
        .isString()
        .withMessage('subtitle must be a string'),
];

export const createProjectValidator: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isString()
        .withMessage('Name must be a string'),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

    body('skills')
        .optional()
        .isArray({ min: 1 }) // Ensure 'skills' is an array and not empty
        .withMessage('Skills must be a non-empty array'),

    body('skills.*')
        .if(body('skills').exists())
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Each skill must be a non-empty string'),

    body('start_date')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),

    body('end_date')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date'),

    body('still_working')
        .optional()
        .isBoolean()
        .withMessage('Still working must be a boolean'),

    body('link')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Link cannot be empty'),
];

export const updateProjectValidator: ValidationChain[] = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isString()
        .withMessage('Name must be a string'),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

    body('skills')
        .optional()
        .isArray() // Ensure 'skills' is an array and not empty
        .withMessage('Skills must be array'),

    body('skills.*')
        .if(body('skills').exists())
        .trim()
        .isString()
        .notEmpty()
        .withMessage('Each skill must be a non-empty string'),

    body('start_date')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),

    body('end_date')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date'),

    body('still_working')
        .optional()
        .isBoolean()
        .withMessage('Still working must be a boolean'),

    body('link')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Link cannot be empty'),
];

export const createVolunteeringValidator: ValidationChain[] = [
    body('organization')
        .trim()
        .notEmpty()
        .withMessage('Organization cannot be empty')
        .isString()
        .withMessage('Organization must be a string'),

    body('role')
        .trim()
        .notEmpty()
        .withMessage('Role cannot be empty')
        .isString()
        .withMessage('Role must be a string'),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

    body('start_date')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),

    body('end_date')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date'),
];

export const updateVolunteeringValidator: ValidationChain[] = [
    body('organization')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Organization cannot be empty')
        .isString()
        .withMessage('Organization must be a string'),

    body('role')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Role cannot be empty')
        .isString()
        .withMessage('Role must be a string'),

    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),

    body('start_date')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),

    body('end_date')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date'),
];
