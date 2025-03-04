import { body, param, ValidationChain } from 'express-validator';

export const resumeTemplateIdValidator: ValidationChain[] = [
    param('resumeTemplateId')
        .isInt()
        .withMessage('resumeTemplateId must be an integer'),
];
