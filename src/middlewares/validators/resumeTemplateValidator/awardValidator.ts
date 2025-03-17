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
    body('date').optional().isDate().withMessage('invalid date'),

    body('description')
        .optional()
        .isString()
        .withMessage('invalid description'),
];

export const awardIdValidator: ValidationChain[] = [
    param('awardContentId')
        .isInt()
        .withMessage('awardContentId must be an integer'),
];

export const getAllAwardsValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
];

export const getOneAwardValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    awardIdValidator[0],
];

export const updateAwardValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    awardIdValidator[0],
    body('award')
        .optional()
        .notEmpty()
        .withMessage('award cant be empty')
        .isString()
        .withMessage('invalid award'),
    body('award_link').optional().isString().withMessage('invalid award_link'),
    body('issuer').optional().isString().withMessage('invalid issuer'),
    body('date').optional().isDate().withMessage('invalid date'),

    body('description')
        .optional()
        .isString()
        .withMessage('invalid description'),
];

export const deleteAwardValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    awardIdValidator[0],
];
