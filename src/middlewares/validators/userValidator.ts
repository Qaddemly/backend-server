import { body, ValidationChain } from 'express-validator';

export const userCreationValidatorStepOne: ValidationChain[] = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .toLowerCase(),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isAlpha()
        .withMessage('First name must be a string of alphabets'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isAlpha()
        .withMessage('Last name must be a string of alphabets'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        } else {
            return value;
        }
    }),
];

const userCreationValidatorStepTwo: ValidationChain[] = [];
