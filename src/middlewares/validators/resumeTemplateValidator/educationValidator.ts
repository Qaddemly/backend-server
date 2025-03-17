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

    body('is_current')
        .optional()
        .isBoolean()
        .withMessage('is_current must be a boolean'),

    body('start_date').optional().isDate().withMessage('invalid start_date'),
    body('end_date').optional().isDate().withMessage('invalid end_date'),
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

export const getAllEducationsValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
];

export const getOneEducationValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    educationIdValidator[0],
];

export const updateEducationValidator: ValidationChain[] = [
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

    body('start_date').optional().isDate().withMessage('invalid start_date'),
    body('end_date').optional().isDate().withMessage('invalid end_date'),
    body('description')
        .optional()
        .isString()
        .withMessage('invalid description'),
];

export const deleteEducationValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    educationIdValidator[0],
];
