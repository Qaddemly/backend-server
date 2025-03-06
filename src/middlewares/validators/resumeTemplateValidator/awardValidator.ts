import { body, param, ValidationChain } from 'express-validator';
import { resumeTemplateIdValidator } from '../resumeTemplateValidator';

export const createAwardValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    body('award')
        .notEmpty()
        .withMessage('award cant be empty')
        .isString()
        .withMessage('invalid award'),
    body('award_link').optional().isString().withMessage('invalid award_link'),
    body('issuer').optional().isString().withMessage('invalid issuer'),
    body('date.day')
        .optional()
        .isInt({ min: 1, max: 31 })
        .withMessage('invalid day'),
    body('date.month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Start month must be between 1 and 12'),

    body('date.year')
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('End year must be a valid year'),

    body('description')
        .optional()
        .isString()
        .withMessage('invalid description'),
];

export const educationIdValidator: ValidationChain[] = [
    param('educationContentId')
        .isInt()
        .withMessage('educationContentId must be an integer'),
];

export const getAllAwardsValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
];

export const getOneAwardValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    educationIdValidator[0],
];

export const updateAwardValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    educationIdValidator[0],
    body('school').optional().isString().withMessage('school name'),
    body('school_link')
        .optional()
        .isString()
        .withMessage('invalid school_link'),
    body('degree').optional().isString().withMessage('invalid degree'),
    body('city').optional().isString().withMessage('invalid city'),
    body('country').optional().isString().withMessage('invalid country'),

    body('is_current')
        .optional()
        .isBoolean()
        .withMessage('is_current must be a boolean'),

    body('start_year')
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('Start year must be a valid year'),

    body('start_month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Start month must be between 1 and 12'),

    body('end_year')
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('End year must be a valid year'),

    body('end_month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('End month must be between 1 and 12'),
    body('description')
        .optional()
        .isString()
        .withMessage('invalid description'),
];

export const deleteAwardValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    educationIdValidator[0],
];
