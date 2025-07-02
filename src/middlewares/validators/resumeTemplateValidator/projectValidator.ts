import { body, param, ValidationChain } from 'express-validator';
import { resumeTemplateIdValidator } from '../resumeTemplateValidator';

export const createProjectValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    body('title')
        .notEmpty()
        .withMessage('title can be empty')
        .isString()
        .withMessage('title name'),
    body('project_link')
        .optional()
        .isString()
        .withMessage('invalid project_link'),
    body('subtitle').optional().isString().withMessage('invalid subtitle'),

    body('is_current')
        .optional()
        .isBoolean()
        .withMessage('is_current must be a boolean'),

    body('start_year')
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('Start year must be a valid year'),

    body('end_year')
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('End year must be a valid year'),

    body('description')
        .optional()
        .isString()
        .withMessage('invalid description'),
];

export const projectIdValidator: ValidationChain[] = [
    param('projectContentId')
        .isInt()
        .withMessage('projectContentId must be an integer'),
];

export const getAllProjectsValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
];

export const getOneProjectValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    projectIdValidator[0],
];

export const updateProjectValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    projectIdValidator[0],
    body('title').optional().isString().withMessage('title name'),
    body('title_link').optional().isString().withMessage('invalid title_link'),
    body('subtitle').optional().isString().withMessage('invalid subtitle'),

    body('is_current')
        .optional()
        .isBoolean()
        .withMessage('is_current must be a boolean'),

    body('start_date').optional().isDate().withMessage('invalid start date'),
    body('end_date').optional().isDate().withMessage('invalid end date'),
    body('description')
        .optional()
        .isString()
        .withMessage('invalid description'),
];

export const deleteProjectValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    projectIdValidator[0],
];
