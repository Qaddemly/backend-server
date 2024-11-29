"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordValidator = exports.loginValidator = exports.changePasswordValidator = exports.resetPasswordValidator = exports.userUpdateValidator = exports.userCreationValidatorStepTwo = exports.userCreationValidatorStepOne = void 0;
const express_validator_1 = require("express-validator");
const countryCode_1 = require("../../enums/countryCode");
const country_1 = require("../../enums/country");
const employmentType_1 = require("../../enums/employmentType");
const locationType_1 = require("../../enums/locationType");
const language_1 = require("../../enums/language");
const userModel_1 = __importDefault(require("../../models/userModel"));
exports.userCreationValidatorStepOne = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .toLowerCase()
        .custom((val) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userModel_1.default.findOne({ email: val });
        if (!user) {
            return true;
        }
        else {
            throw new Error('Email already exists');
        }
    })),
    (0, express_validator_1.body)('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isAlpha()
        .withMessage('First name must be a string of alphabets'),
    (0, express_validator_1.body)('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isAlpha()
        .withMessage('Last name must be a string of alphabets'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        else {
            return value;
        }
    }),
];
exports.userCreationValidatorStepTwo = [
    (0, express_validator_1.body)('phone').optional().isObject(),
    (0, express_validator_1.body)('phone.countryCode')
        .if((0, express_validator_1.body)('phone').exists())
        .notEmpty()
        .withMessage('Country code cannot be empty')
        .custom((value) => {
        if (value in countryCode_1.CountryCode)
            return value;
        else
            throw new Error('Invalid country code');
    }),
    (0, express_validator_1.body)('phone.number')
        .if((0, express_validator_1.body)('phone').exists())
        .notEmpty()
        .withMessage('Phone number cannot be empty')
        .isNumeric()
        .withMessage('Phone number must be numeric'),
    (0, express_validator_1.body)('address').optional().isObject(),
    (0, express_validator_1.body)('address.country')
        .if((0, express_validator_1.body)('address').exists())
        .trim()
        .notEmpty()
        .withMessage('Country cannot be empty')
        .custom((value) => {
        if (value in country_1.Country)
            return value;
        else
            throw new Error('Country Name is invalid (not in the country list)');
    }),
    (0, express_validator_1.body)('address.city')
        .if((0, express_validator_1.body)('address').exists())
        .trim()
        .notEmpty()
        .withMessage('City cannot be empty')
        .isAlpha()
        .withMessage('City must be a string of alphabets'),
    (0, express_validator_1.body)('dateOfBirth')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid date of birth'),
    (0, express_validator_1.body)('education').optional().isObject(),
    (0, express_validator_1.body)('education.university')
        .if((0, express_validator_1.body)('education').exists())
        .trim()
        .notEmpty()
        .withMessage('University name cannot be empty'),
    (0, express_validator_1.body)('education.fieldOfStudy')
        .if((0, express_validator_1.body)('education').exists())
        .trim()
        .notEmpty()
        .withMessage('Field of study cannot be empty'),
    (0, express_validator_1.body)('education.gpa')
        .if((0, express_validator_1.body)('education').exists())
        .notEmpty()
        .withMessage('GPA cannot be empty')
        .isNumeric()
        .withMessage('GPA must be a number')
        .custom((value) => {
        if (value >= 0 && value <= 4)
            return value;
        else
            throw new Error('GPA must be between 0 and 4');
    }),
    (0, express_validator_1.body)('education.startDate')
        .if((0, express_validator_1.body)('education').exists())
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),
    (0, express_validator_1.body)('education.endDate')
        .if((0, express_validator_1.body)('education').exists())
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date'),
    (0, express_validator_1.body)('experience').optional().isArray(),
    (0, express_validator_1.body)('experience.*')
        .if((0, express_validator_1.body)('experience').exists())
        .isObject()
        .withMessage('Experience must be an object'),
    (0, express_validator_1.body)('experience.*.jobTitle')
        .if((0, express_validator_1.body)('experience').exists())
        .trim()
        .notEmpty()
        .withMessage('Job title cannot be empty'),
    (0, express_validator_1.body)('experience.*.employmentType')
        .if((0, express_validator_1.body)('experience').exists())
        .trim()
        .notEmpty()
        .withMessage('Employment type cannot be empty')
        .custom((value) => {
        if (value in employmentType_1.EmploymentType)
            return value;
        else
            throw new Error('Invalid employment type');
    }),
    (0, express_validator_1.body)('experience.*.companyName')
        .if((0, express_validator_1.body)('experience').exists())
        .trim()
        .notEmpty()
        .withMessage('Company name cannot be empty'),
    (0, express_validator_1.body)('experience.*.location')
        .if((0, express_validator_1.body)('experience').exists())
        .trim()
        .notEmpty()
        .withMessage('Location cannot be empty'),
    (0, express_validator_1.body)('experience.*.locationType')
        .if((0, express_validator_1.body)('experience').exists())
        .trim()
        .notEmpty()
        .withMessage('Location type cannot be empty')
        .custom((value) => {
        if (value in locationType_1.LocationType)
            return value;
        else
            throw new Error('Invalid location type');
    }),
    (0, express_validator_1.body)('experience.*.stillWorking')
        .if((0, express_validator_1.body)('experience').exists())
        .isBoolean()
        .withMessage('Still working must be a boolean'),
    (0, express_validator_1.body)('experience.*.startDate')
        .if((0, express_validator_1.body)('experience').exists())
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),
    // Optional Fix
    (0, express_validator_1.body)('experience.*.endDate')
        .if((0, express_validator_1.body)('experience').exists())
        .custom((value, { req, path, pathValues }) => {
        const idx = Number(pathValues[1]);
        console.log(req.body.experience[idx].stillWorking);
        return req.body.experience[idx].stillWorking === false;
    })
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date')
        .optional(),
    (0, express_validator_1.body)('skills').optional().isArray(),
    (0, express_validator_1.body)('skills.*')
        .if((0, express_validator_1.body)('skills').exists())
        .trim()
        .notEmpty()
        .withMessage('Skill cannot be empty'),
    (0, express_validator_1.body)('languages').optional().isArray(),
    (0, express_validator_1.body)('languages.*')
        .if((0, express_validator_1.body)('languages').exists())
        .trim()
        .notEmpty()
        .withMessage('Language cannot be empty')
        .custom((value) => {
        if (value in language_1.Language)
            return value;
        else
            throw new Error('Invalid language');
    }),
];
exports.userUpdateValidator = [
    (0, express_validator_1.body)('email')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .toLowerCase(),
    (0, express_validator_1.body)('firstName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isAlpha()
        .withMessage('First name must be a string of alphabets'),
    (0, express_validator_1.body)('lastName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isAlpha()
        .withMessage('Last name must be a string of alphabets'),
    (0, express_validator_1.body)('phone').optional().isObject(),
    (0, express_validator_1.body)('phone.countryCode')
        .optional()
        .notEmpty()
        .withMessage('Country code cannot be empty')
        .custom((value) => {
        if (value in countryCode_1.CountryCode)
            return value;
        else
            throw new Error('Invalid country code');
    }),
    (0, express_validator_1.body)('phone.number')
        .optional()
        .notEmpty()
        .withMessage('Phone number cannot be empty')
        .isNumeric()
        .withMessage('Phone number must be numeric'),
    (0, express_validator_1.body)('address').optional().isObject(),
    (0, express_validator_1.body)('address.country')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Country cannot be empty')
        .custom((value) => {
        if (value in country_1.Country)
            return value;
        else
            throw new Error('Country Name is invalid (not in the country list)');
    }),
    (0, express_validator_1.body)('address.city')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('City cannot be empty')
        .isAlpha()
        .withMessage('City must be a string of alphabets'),
    (0, express_validator_1.body)('dateOfBirth')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid date of birth'),
    (0, express_validator_1.body)('education').optional().isObject(),
    (0, express_validator_1.body)('education.university')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('University name cannot be empty'),
    (0, express_validator_1.body)('education.fieldOfStudy')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Field of study cannot be empty'),
    (0, express_validator_1.body)('education.gpa')
        .optional()
        .notEmpty()
        .withMessage('GPA cannot be empty')
        .isNumeric()
        .withMessage('GPA must be a number')
        .custom((value) => {
        if (value >= 0 && value <= 4)
            return value;
        else
            throw new Error('GPA must be between 0 and 4');
    }),
    (0, express_validator_1.body)('education.startDate')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),
    (0, express_validator_1.body)('education.endDate')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date'),
    (0, express_validator_1.body)('experience').optional().isArray(),
    (0, express_validator_1.body)('experience.*')
        .optional()
        .isObject()
        .withMessage('Experience must be an object'),
    (0, express_validator_1.body)('experience.*.jobTitle')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Job title cannot be empty'),
    (0, express_validator_1.body)('experience.*.employmentType')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Employment type cannot be empty')
        .custom((value) => {
        if (value in employmentType_1.EmploymentType)
            return value;
        else
            throw new Error('Invalid employment type');
    }),
    (0, express_validator_1.body)('experience.*.companyName')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Company name cannot be empty'),
    (0, express_validator_1.body)('experience.*.location')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Location cannot be empty'),
    (0, express_validator_1.body)('experience.*.locationType')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Location type cannot be empty')
        .custom((value) => {
        if (value in locationType_1.LocationType)
            return value;
        else
            throw new Error('Invalid location type');
    }),
    (0, express_validator_1.body)('experience.*.stillWorking')
        .optional()
        .isBoolean()
        .withMessage('Still working must be a boolean'),
    (0, express_validator_1.body)('experience.*.startDate')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid start date'),
    (0, express_validator_1.body)('experience.*.endDate')
        .optional()
        .custom((value, { req, path, pathValues }) => {
        const idx = Number(pathValues[1]);
        console.log(req.body.experience[idx].stillWorking);
        return req.body.experience[idx].stillWorking === false;
    })
        .isDate({ format: 'YYYY-MM-DD' })
        .withMessage('Invalid end date')
        .optional(),
    (0, express_validator_1.body)('skills').optional().isArray(),
    (0, express_validator_1.body)('skills.*')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Skill cannot be empty'),
    (0, express_validator_1.body)('languages').optional().isArray(),
    (0, express_validator_1.body)('languages.*')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Language cannot be empty')
        .custom((value) => {
        if (value in language_1.Language)
            return value;
        else
            throw new Error('Invalid language');
    }),
];
exports.resetPasswordValidator = [
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('newPasswordConfirm').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Passwords do not match');
        }
        else {
            return value;
        }
    }),
];
exports.changePasswordValidator = [
    (0, express_validator_1.body)('currentPassword').custom((val, { req }) => {
        if (req.user.password) {
            if (!val) {
                throw new Error('currentPassword cannot be empty');
            }
            else {
                return true;
            }
        }
        return true;
    }),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('newPasswordConfirm').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Passwords do not match');
        }
        else {
            return value;
        }
    }),
];
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .toLowerCase(),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password cannot be empty'),
];
exports.forgetPasswordValidator = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .toLowerCase(),
];
