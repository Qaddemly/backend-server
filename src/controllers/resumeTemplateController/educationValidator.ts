import { body, param, ValidationChain } from 'express-validator';
import { resumeTemplateIdValidator } from '../resumeTemplateValidator';

export const createEducationValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    body('school').optional().isString().withMessage('school name'),
    body('school_link')
        .optional()
        .isString()
        .withMessage('invalid school_link'),
    body('degree').optional().isString().withMessage('invalid degree'),
    body('city').optional().isString().withMessage('invalid city'),
    body('country').optional().isString().withMessage('invalid country'),
    body('start_year')
        .optional()
        .isInt({ min: 1946, max: new Date().getFullYear() })
        .withMessage('Start year must be a valid year (1946 - current year)'),

    body('start_month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Start month must be between 1 and 12'),

    body('end_year')
        .optional()
        .isInt({ min: 1946, max: new Date().getFullYear() })
        .withMessage('End year must be a valid year (1946 - current year)'),

    body('end_month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('End month must be between 1 and 12'),
    body('is_current')
        .optional()
        .isBoolean()
        .withMessage('is_current must be a boolean'),

    body('only_start_year')
        .optional()
        .isBoolean()
        .withMessage('only_start_year must be a boolean'),

    body('only_end_year')
        .optional()
        .isBoolean()
        .withMessage('only_end_year must be a boolean'),
    body('show_start_date')
        .optional()
        .isBoolean()
        .withMessage('show_start_date must be a boolean'),

    body('show_end_date')
        .optional()
        .isBoolean()
        .withMessage('show_end_date must be a boolean'),
    body('description').optional().isString().withMessage('invalid country'),
];

export const educationIdValidator: ValidationChain[] = [
    param('educationContentId')
        .isInt()
        .withMessage('educationContentId must be an integer'),
];

export const getAllEducationsValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
];

export const getOneEducationValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    educationIdValidator[0],
];

export const updateEducationValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    getOneEducationValidator[0],
    body('school').optional().isString().withMessage('school name'),
    body('school_link')
        .optional()
        .isString()
        .withMessage('invalid school_link'),
    body('degree').optional().isString().withMessage('invalid degree'),
    body('city').optional().isString().withMessage('invalid city'),
    body('country').optional().isString().withMessage('invalid country'),
    body('start_year')
        .optional()
        .isInt({ min: 1946, max: new Date().getFullYear() })
        .withMessage('Start year must be a valid year (1946 - current year)'),

    body('start_month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('Start month must be between 1 and 12'),

    body('end_year')
        .optional()
        .isInt({ min: 1946, max: new Date().getFullYear() })
        .withMessage('End year must be a valid year (1946 - current year)'),

    body('end_month')
        .optional()
        .isInt({ min: 1, max: 12 })
        .withMessage('End month must be between 1 and 12'),
    body('is_current')
        .optional()
        .isBoolean()
        .withMessage('is_current must be a boolean'),

    body('only_start_year')
        .optional()
        .isBoolean()
        .withMessage('only_start_year must be a boolean'),

    body('only_end_year')
        .optional()
        .isBoolean()
        .withMessage('only_end_year must be a boolean'),
    body('show_start_date')
        .optional()
        .isBoolean()
        .withMessage('show_start_date must be a boolean'),

    body('show_end_date')
        .optional()
        .isBoolean()
        .withMessage('show_end_date must be a boolean'),
    body('description').optional().isString().withMessage('invalid country'),
];

export const deleteEducationValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    educationIdValidator[0],
];
