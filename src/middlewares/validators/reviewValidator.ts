import { body, param, ValidationChain } from 'express-validator';

export const createReviewValidator: ValidationChain[] = [
    body('business_id')
        .notEmpty()
        .withMessage('business_id required')
        .isNumeric()
        .withMessage('in valid business_id'),

    body('description')
        .isString()
        .withMessage('description must be string')
        .notEmpty()
        .withMessage('description required')
        .isLength({ min: 2 })
        .withMessage('description must be at least 2 characters'),
    body('rating')
        .notEmpty()
        .withMessage('rating cant be empty')
        .isNumeric()
        .withMessage('invalid rating')
        .custom((value) => {
            if (value >= 1 && value <= 5) return value;
            else throw new Error('rating must be between 1 and 5');
        }),
];

export const updateReviewValidator: ValidationChain[] = [
    body('description')
        .optional()
        .isString()
        .withMessage('description must be string')
        .isLength({ min: 2 })
        .withMessage('description must be at least 2 characters'),
    body('rating')
        .optional()
        .isNumeric()
        .withMessage('invalid rating')
        .custom((value) => {
            if (value >= 1 && value <= 5) return value;
            else throw new Error('rating must be between 1 and 5');
        }),
];

export const idValidator: ValidationChain[] = [
    param('id').isInt().withMessage('id must be an integer'),
];
