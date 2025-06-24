import { body, ValidationChain } from 'express-validator';

export const jobEnhancementOrGenerateValidation: ValidationChain[] = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('skills')
        .optional()
        .isArray()
        .withMessage('Skills must be an array of strings'),
    body('keywords')
        .optional()
        .isArray()
        .withMessage('Keywords must be an array of strings'),
];
export const jobPostGenerationValidation: ValidationChain[] = [
    body('prompt').notEmpty().withMessage('Prompt is required'),
];
