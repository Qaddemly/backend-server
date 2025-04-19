import { body, param, ValidationChain } from 'express-validator';

export const CreateCoverLetterValidator = [
    body('name').isString().withMessage('name must be valid string'),
];

export const coverLetterIdValidator: ValidationChain[] = [
    param('coverLetterId')
        .isInt()
        .withMessage('coverLettedId must be an integer'),
];

export const UpdateCoverLetterValidator = [
    coverLetterIdValidator[0],
    body('name')
        .optional()
        .isString()
        .trim()
        .withMessage('name must be valid string'),
    body('body')
        .optional()
        .isString()
        .withMessage('body must be a valid string'),
    body('date').optional().isDate().withMessage('date must be a valid date'),
    body('recipientDetails')
        .optional()
        .isObject()
        .withMessage('Recipient details must be an object'),

    body('recipientDetails.nameOfRecipient')
        .optional()
        .isString()
        .withMessage('Recipient name must be a string'),

    body('recipientDetails.companyName')
        .optional()
        .isString()
        .withMessage('Company name must be a string'),

    body('recipientDetails.address')
        .optional()
        .isString()
        .withMessage('Address must be a string'),
];

export const CreatePersonalDetailsValidator = [
    coverLetterIdValidator[0],
    body('full_name')
        .optional()
        .isString()
        .withMessage('full_name must be a valid string'),
    body('job_title')
        .optional()
        .isString()
        .withMessage('job_title must be a valid string'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('email must be a valid email'),
    body('phone_number')
        .optional()
        .isString()
        .withMessage('phone_number must be a valid string'),
    body('address')
        .optional()
        .isString()
        .withMessage('address must be a valid string'),
    body('picture')
        .optional()
        .isString()
        .withMessage('picture must be a valid string'),
    body('personal_information')
        .optional()
        .isObject()
        .withMessage('personal_information must be an object'),
    body('links').optional().isObject().withMessage('links must be an object'),
];

export const UpdatePersonalDetailsValidator = [
    coverLetterIdValidator[0],
    body('full_name')
        .optional()
        .isString()
        .withMessage('full_name must be a valid string'),
    body('job_title')
        .optional()
        .isString()
        .withMessage('job_title must be a valid string'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('email must be a valid email'),
    body('phone_number')
        .optional()
        .isString()
        .withMessage('phone_number must be a valid string'),
    body('address')
        .optional()
        .isString()
        .withMessage('address must be a valid string'),
    body('picture')
        .optional()
        .isString()
        .withMessage('picture must be a valid string'),
    body('personal_information')
        .optional()
        .isObject()
        .withMessage('personal_information must be an object'),
    body('links').optional().isObject().withMessage('links must be an object'),
];

export const DeletePersonalDetailsValidator = [coverLetterIdValidator[0]];
