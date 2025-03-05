import { body, param, ValidationChain } from 'express-validator';
import { optional } from 'inversify';
import { LanguageLevel } from '../../enums/languageLevel';

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
export const createOrUpdateLanguageOfResumeTemplateValidator: ValidationChain[] =
    [
        body('language')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('language cant be empty')
            .isString()
            .withMessage('invalid language'),
        body('level')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('level cant be empty')
            .custom((value) => {
                if (value in LanguageLevel) {
                    return value;
                } else {
                    throw new Error('invalid level');
                }
            }),
        body('additional_info')
            .optional()
            .trim()
            .isString()
            .withMessage('invalid additional_info'),
    ];
export const createOrUpdateInterestOfResumeTemplateValidator: ValidationChain[] =
    [
        body('interest')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('interest cant be empty')
            .isString()
            .withMessage('invalid interest'),
        body('description')
            .optional()
            .trim()
            .isString()
            .withMessage('invalid description'),
    ];

export const createCourseOfResumeTemplateValidator: ValidationChain[] = [
    body('course')
        .trim()
        .notEmpty()
        .withMessage('Course cant be empty')
        .isString()
        .withMessage('Course title is not valid'),
    body('institution')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('institution cant be empty')
        .isString()
        .withMessage('institution is not valid'),
    body('city')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('city cant be empty')
        .isString()
        .withMessage('city is not valid'),
    body('country')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('country cant be empty')
        .isString()
        .withMessage('country is not valid'),
    body('start_date').optional().isDate().withMessage('invalid start_date'),
    body('end_date').optional().isDate().withMessage('invalid end_date'),
    body('is_current').optional().isBoolean().withMessage('invalid is_current'),
    body('description')
        .optional()
        .trim()
        .isString()
        .withMessage('invalid description'),
];

export const updateCourseOfResumeTemplateValidator: ValidationChain[] = [
    body('course')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Course cant be empty')
        .isString()
        .withMessage('Course title is not valid'),
    body('institution')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('institution cant be empty')
        .isString()
        .withMessage('institution is not valid'),
    body('city')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('city cant be empty')
        .isString()
        .withMessage('city is not valid'),
    body('country')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('country cant be empty')
        .isString()
        .withMessage('country is not valid'),
    body('start_date').optional().isDate().withMessage('invalid start_date'),
    body('end_date').optional().isDate().withMessage('invalid end_date'),
    body('is_current').optional().isBoolean().withMessage('invalid is_current'),
    body('description')
        .optional()
        .trim()
        .isString()
        .withMessage('invalid description'),
];

export const createOrganizationOfResumeTemplateValidator: ValidationChain[] = [
    body('organization')
        .trim()
        .notEmpty()
        .withMessage('organization cant be empty')
        .isString()
        .withMessage('invalid organization'),
    body('position')
        .optional()
        .trim()
        .isString()
        .withMessage('invalid position'),
    body('city').optional().trim().isString().withMessage('invalid city'),
    body('country').optional().trim().isString().withMessage('invalid country'),
    body('start_date').optional().isDate().withMessage('invalid start_date'),
    body('end_date').optional().isDate().withMessage('invalid end_date'),
    body('is_current').optional().isBoolean().withMessage('invalid is_current'),
    body('description')
        .optional()
        .trim()
        .isString()
        .withMessage('invalid description'),
];

export const updateOrganizationOfResumeTemplateValidator: ValidationChain[] = [
    body('organization')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('organization cant be empty')
        .isString()
        .withMessage('invalid organization'),
    body('position')
        .optional()
        .trim()
        .isString()
        .withMessage('invalid position'),
    body('city').optional().trim().isString().withMessage('invalid city'),
    body('country').optional().trim().isString().withMessage('invalid country'),
    body('start_date').optional().isDate().withMessage('invalid start_date'),
    body('end_date').optional().isDate().withMessage('invalid end_date'),
    body('is_current').optional().isBoolean().withMessage('invalid is_current'),
    body('description')
        .optional()
        .trim()
        .isString()
        .withMessage('invalid description'),
];

export const createCustomSectionOfResumeTemplateValidator: ValidationChain[] = [
    body('section_name')
        .trim()
        .notEmpty()
        .withMessage('section_name cant be empty')
        .isString()
        .withMessage('invalid section_name'),
    body('title').optional().trim().isString().withMessage('invalid title'),
    body('subtitle')
        .optional()
        .trim()
        .isString()
        .withMessage('invalid subtitle'),
    body('city').optional().trim().isString().withMessage('invalid city'),
    body('country').optional().trim().isString().withMessage('invalid country'),
    body('start_date').optional().isDate().withMessage('invalid start_date'),
    body('end_date').optional().isDate().withMessage('invalid end_date'),
    body('is_current').optional().isBoolean().withMessage('invalid is_current'),
    body('description')
        .optional()
        .trim()
        .isString()
        .withMessage('invalid description'),
];

export const updateCustomSectionOfResumeTemplateValidator: ValidationChain[] = [
    body('section_name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('section_name cant be empty')
        .isString()
        .withMessage('invalid section_name'),
    body('title').optional().trim().isString().withMessage('invalid title'),
    body('subtitle')
        .optional()
        .trim()
        .isString()
        .withMessage('invalid subtitle'),
    body('city').optional().trim().isString().withMessage('invalid city'),
    body('country').optional().trim().isString().withMessage('invalid country'),
    body('start_date').optional().isDate().withMessage('invalid start_date'),
    body('end_date').optional().isDate().withMessage('invalid end_date'),
    body('is_current').optional().isBoolean().withMessage('invalid is_current'),
    body('description')
        .optional()
        .trim()
        .isString()
        .withMessage('invalid description'),
];

export const createOrUpdateReferenceOfResumeTemplateValidator: ValidationChain[] =
    [
        body('name')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('name cant be empty')
            .isString()
            .withMessage('invalid name'),
        body('job_title')
            .optional()
            .trim()
            .isString()
            .withMessage('invalid job_title'),
        body('organization')
            .optional()
            .trim()
            .isString()
            .withMessage('invalid organization'),
        body('email').optional().trim().isEmail().withMessage('invalid email'),
        body('phone').optional().trim().isString().withMessage('invalid phone'),
    ];
