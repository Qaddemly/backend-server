import { body, param, ValidationChain } from 'express-validator';
import { resumeTemplateIdValidator } from '../resumeTemplateValidator';

export const createPersonalInfoValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    body('full_name')
        .optional()
        .notEmpty()
        .withMessage('full_name cant be empty')
        .isString()
        .withMessage('in valid full_name'),
    body('email')
        .optional()
        .notEmpty()
        .withMessage('email cant be empty')
        .isEmail()
        .withMessage('in valid email'),
    body('phone_number')
        .optional()
        .notEmpty()
        .withMessage('phone_number cant be empty')
        .isString()
        .withMessage('in valid phone_number'),
    body('address')
        .optional()
        .notEmpty()
        .withMessage('address cant be empty')
        .isString()
        .withMessage('in valid address'),
    body('profile_picture')
        .optional()
        .isString()
        .withMessage('in valid personal_information'),
    body('links').optional().isObject().withMessage('in valid links'),
    body('personal_information')
        .optional()
        .isObject()
        .withMessage('in valid personal_information'),
];

export const personalInfoIdValidator: ValidationChain[] = [
    param('personaInfoContentId')
        .isInt()
        .withMessage('personaInfoContentId must be an integer'),
];

export const getOnePersonalInfoValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    personalInfoIdValidator[0],
];

export const updatePersonalInfoValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    getOnePersonalInfoValidator[0],
    body('full_name')
        .optional()
        .notEmpty()
        .withMessage('full_name cant be empty')
        .isString()
        .withMessage('in valid full_name'),
    body('email')
        .optional()
        .notEmpty()
        .withMessage('email cant be empty')
        .isEmail()
        .withMessage('in valid email'),
    body('phone_number')
        .optional()
        .notEmpty()
        .withMessage('phone_number cant be empty')
        .isString()
        .withMessage('in valid phone_number'),
    body('address')
        .optional()
        .notEmpty()
        .withMessage('address cant be empty')
        .isString()
        .withMessage('in valid address'),

    body('picture').optional().isString().withMessage('in valid picture'),
    body('links').optional().isObject().withMessage('in valid links'),
    body('personal_information')
        .optional()
        .isObject()
        .withMessage('in valid personal_information'),
];

export const deletePersonalInfoValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    personalInfoIdValidator[0],
];
