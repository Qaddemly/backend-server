import { body, param, ValidationChain } from 'express-validator';

export const updateResumeTemplateProfileValidator: ValidationChain[] = [
    body('profile')
        .trim()
        .notEmpty()
        .withMessage('profile cant be empty')
        .isString()
        .withMessage('invalid profile'),
];
export const createOrUpdateExperienceOfResumeTemplateValidator: ValidationChain[] =
    [
        body('job_title')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('job_title cant be empty')
            .isString()
            .withMessage('invalid job_title'),
        body('company_name')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('company_name cant be empty')
            .isString()
            .withMessage('invalid company_name'),
        body('city')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('city cant be empty')
            .isString()
            .withMessage('invalid city'),
        body('country')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('country cant be empty')
            .isString()
            .withMessage('invalid country'),
        body('start_date')
            .optional()
            .isDate()
            .withMessage('invalid start_date'),
        body('end_date').optional().isDate().withMessage('invalid end_date'),
        body('is_current')
            .optional()
            .isBoolean()
            .withMessage('invalid is_current'),
        body('description')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('description cant be empty')
            .isString()
            .withMessage('invalid description'),
    ];
