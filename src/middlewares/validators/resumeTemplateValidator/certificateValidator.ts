import { body, param, ValidationChain } from 'express-validator';
import { resumeTemplateIdValidator } from '../resumeTemplateValidator';

export const createCertificateValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    body('certificate')
        .notEmpty()
        .withMessage('certificate cant be empty')
        .isString()
        .withMessage('invalid certificate'),
    body('certificate_url')
        .optional()
        .isString()
        .withMessage('invalid certificate_url'),
    body('additional_information')
        .optional()
        .isString()
        .withMessage('invalid additional_information'),
];

export const certificateIdValidator: ValidationChain[] = [
    param('certificateContentId')
        .isInt()
        .withMessage('certificateContentId must be an integer'),
];

export const getAllCertificatesValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
];

export const getOneCertificateValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    certificateIdValidator[0],
];

export const updateCertificateValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    certificateIdValidator[0],
    body('certificate')
        .optional()
        .notEmpty()
        .withMessage('certificate cant be empty')
        .isString()
        .withMessage('invalid certificate'),
    body('certificate_url')
        .optional()
        .isString()
        .withMessage('invalid certificate_url'),
    body('additional_information')
        .optional()
        .isString()
        .withMessage('invalid additional_information'),
];

export const deleteCertificateValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    certificateIdValidator[0],
];
