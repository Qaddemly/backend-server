import { body, param, ValidationChain } from 'express-validator';
import { resumeTemplateIdValidator } from '../resumeTemplateValidator';

export const createPublicationValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    body('title')
        .optional()
        .notEmpty()
        .withMessage('title cant be empty')
        .isString()
        .withMessage('invalid title'),
    body('publication_link')
        .optional()
        .isString()
        .withMessage('invalid publication_link'),
    body('publisher').optional().isString().withMessage('invalid publisher'),
    body('date').optional().isDate().withMessage('invalid date'),

    body('description')
        .optional()
        .isString()
        .withMessage('invalid description'),
];

export const publicationIdValidator: ValidationChain[] = [
    param('publicationContentId')
        .isInt()
        .withMessage('publicationContentId must be an integer'),
];

export const getAllPublicationsValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
];

export const getOnePublicationValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    publicationIdValidator[0],
];

export const updatePublicationValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    publicationIdValidator[0],
    body('title')
        .optional()
        .notEmpty()
        .withMessage('title cant be empty')
        .isString()
        .withMessage('invalid title'),
    body('publication_link')
        .optional()
        .isString()
        .withMessage('invalid publication_link'),
    body('publisher').optional().isString().withMessage('invalid publisher'),
    body('date').optional().isDate().withMessage('invalid date'),

    body('description')
        .optional()
        .isString()
        .withMessage('invalid description'),
];

export const deletePublicationValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    publicationIdValidator[0],
];
