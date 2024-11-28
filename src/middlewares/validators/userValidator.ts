import { body, ValidationChain } from 'express-validator';
import { CountryCode } from '../../enums/countryCode';
import { Country } from '../../enums/country';
import { EmploymentType } from '../../enums/employmentType';
import { LocationType } from '../../enums/locationType';
import { Language } from '../../enums/language';
import User from '../../models/userModel';
import { RequestHandler } from 'express';

export const userCreationValidatorStepOne: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .toLowerCase()
        .custom(async (val) => {
            const user = await User.findOne({ email: val });
            if (!user) {
                return true;
            } else {
                throw new Error('Email already exists');
            }
        }),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isAlpha()
        .withMessage('First name must be a string of alphabets'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isAlpha()
        .withMessage('Last name must be a string of alphabets'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        } else {
            return value;
        }
    }),
];

export const userCreationValidatorStepTwo: ValidationChain[] = [
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
    body('dateOfBirth')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid date of birth'),
    body('education').optional().isObject(),
    body('education.university')
        .if(body('education').exists())
        .trim()
        .notEmpty()
        .withMessage('University name cannot be empty'),
    body('education.fieldOfStudy')
        .if(body('education').exists())
        .trim()
        .notEmpty()
        .withMessage('Field of study cannot be empty'),
    body('education.gpa')
        .if(body('education').exists())
        .notEmpty()
        .withMessage('GPA cannot be empty')
        .isNumeric()
        .withMessage('GPA must be a number')
        .custom((value) => {
            if (value >= 0 && value <= 4) return value;
            else throw new Error('GPA must be between 0 and 4');
        }),
    body('education.startDate')
        .if(body('education').exists())
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),
    body('education.endDate')
        .if(body('education').exists())
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date'),
    body('experience').optional().isArray(),
    body('experience.*')
        .if(body('experience').exists())
        .isObject()
        .withMessage('Experience must be an object'),
    body('experience.*.jobTitle')
        .if(body('experience').exists())
        .trim()
        .notEmpty()
        .withMessage('Job title cannot be empty'),
    body('experience.*.employmentType')
        .if(body('experience').exists())
        .trim()
        .notEmpty()
        .withMessage('Employment type cannot be empty')
        .custom((value) => {
            if (value in EmploymentType) return value;
            else throw new Error('Invalid employment type');
        }),
    body('experience.*.companyName')
        .if(body('experience').exists())
        .trim()
        .notEmpty()
        .withMessage('Company name cannot be empty'),
    body('experience.*.location')
        .if(body('experience').exists())
        .trim()
        .notEmpty()
        .withMessage('Location cannot be empty'),
    body('experience.*.locationType')
        .if(body('experience').exists())
        .trim()
        .notEmpty()
        .withMessage('Location type cannot be empty')
        .custom((value) => {
            if (value in LocationType) return value;
            else throw new Error('Invalid location type');
        }),
    body('experience.*.stillWorking')
        .if(body('experience').exists())
        .isBoolean()
        .withMessage('Still working must be a boolean'),
    body('experience.*.startDate')
        .if(body('experience').exists())
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),
    // Optional Fix
    body('experience.*.endDate')
        .if(body('experience').exists())
        .custom((value, { req, path, pathValues }) => {
            const idx = Number(pathValues[1]);
            console.log(req.body.experience[idx].stillWorking);
            return req.body.experience[idx].stillWorking === false;
        })
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date')
        .optional(),
    body('skills').optional().isArray(),
    body('skills.*')
        .if(body('skills').exists())
        .trim()
        .notEmpty()
        .withMessage('Skill cannot be empty'),
    body('languages').optional().isArray(),
    body('languages.*')
        .if(body('languages').exists())
        .trim()
        .notEmpty()
        .withMessage('Language cannot be empty')
        .custom((value) => {
            if (value in Language) return value;
            else throw new Error('Invalid language');
        }),
];

export const userUpdateValidator: ValidationChain[] = [
    body('email')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .toLowerCase(),
    body('firstName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isAlpha()
        .withMessage('First name must be a string of alphabets'),
    body('lastName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isAlpha()
        .withMessage('Last name must be a string of alphabets'),
    body('phone').optional().isObject(),
    body('phone.countryCode')
        .optional()
        .notEmpty()
        .withMessage('Country code cannot be empty')
        .custom((value) => {
            if (value in CountryCode) return value;
            else throw new Error('Invalid country code');
        }),
    body('phone.number')
        .optional()
        .notEmpty()
        .withMessage('Phone number cannot be empty')
        .isNumeric()
        .withMessage('Phone number must be numeric'),
    body('address').optional().isObject(),
    body('address.country')
        .optional()
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
        .optional()
        .trim()
        .notEmpty()
        .withMessage('City cannot be empty')
        .isAlpha()
        .withMessage('City must be a string of alphabets'),
    body('dateOfBirth')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid date of birth'),
    body('education').optional().isObject(),
    body('education.university')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('University name cannot be empty'),
    body('education.fieldOfStudy')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Field of study cannot be empty'),
    body('education.gpa')
        .optional()
        .notEmpty()
        .withMessage('GPA cannot be empty')
        .isNumeric()
        .withMessage('GPA must be a number')
        .custom((value) => {
            if (value >= 0 && value <= 4) return value;
            else throw new Error('GPA must be between 0 and 4');
        }),
    body('education.startDate')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),
    body('education.endDate')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date'),
    body('experience').optional().isArray(),
    body('experience.*')
        .optional()
        .isObject()
        .withMessage('Experience must be an object'),
    body('experience.*.jobTitle')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Job title cannot be empty'),
    body('experience.*.employmentType')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Employment type cannot be empty')
        .custom((value) => {
            if (value in EmploymentType) return value;
            else throw new Error('Invalid employment type');
        }),
    body('experience.*.companyName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Company name cannot be empty'),
    body('experience.*.location')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Location cannot be empty'),
    body('experience.*.locationType')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Location type cannot be empty')
        .custom((value) => {
            if (value in LocationType) return value;
            else throw new Error('Invalid location type');
        }),
    body('experience.*.stillWorking')
        .optional()
        .isBoolean()
        .withMessage('Still working must be a boolean'),
    body('experience.*.startDate')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),
    body('experience.*.endDate')
        .optional()
        .custom((value, { req, path, pathValues }) => {
            const idx = Number(pathValues[1]);
            console.log(req.body.experience[idx].stillWorking);
            return req.body.experience[idx].stillWorking === false;
        })
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date')
        .optional(),
    body('skills').optional().isArray(),
    body('skills.*')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Skill cannot be empty'),
    body('languages').optional().isArray(),
    body('languages.*')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Language cannot be empty')
        .custom((value) => {
            if (value in Language) return value;
            else throw new Error('Invalid language');
        }),
];

export const resetPasswordValidator: ValidationChain[] = [
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('newPasswordConfirm').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Passwords do not match');
        } else {
            return value;
        }
    }),
];

export const loginValidator: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .toLowerCase(),
    body('password').notEmpty().withMessage('Password cannot be empty'),
];
