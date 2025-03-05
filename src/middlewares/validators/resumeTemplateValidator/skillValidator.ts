import { body, param, ValidationChain } from 'express-validator';
import { resumeTemplateIdValidator } from '../resumeTemplateValidator';
import { SkillLevel } from '../../../enums/skillLevel';

export const createSkillValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    body('name')
        .notEmpty()
        .withMessage('skill name cant be empty')
        .isString()
        .withMessage('invalid name'),
    body('information')
        .optional()
        .notEmpty()
        .withMessage('information cant be empty')
        .isString()
        .withMessage('invalid information'),
    body('level')
        .optional()
        .notEmpty()
        .withMessage('level cant be empty')
        .isIn(Object.values(SkillLevel))
        .withMessage(
            `level must be one of: ${Object.values(SkillLevel).join(', ')}`,
        ),
];

export const skillIdValidator: ValidationChain[] = [
    param('skillContentId')
        .isInt()
        .withMessage('skillContentId must be an integer'),
];

export const getAllSkillsValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
];

export const getOneSkillValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    skillIdValidator[0],
];

export const updateSkillValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    skillIdValidator[0],
    body('name')
        .optional()
        .notEmpty()
        .withMessage('skill name cant be empty')
        .isString()
        .withMessage('invalid name'),
    body('information')
        .optional()
        .notEmpty()
        .withMessage('information cant be empty')
        .isString()
        .withMessage('invalid information'),
    body('level')
        .optional()
        .notEmpty()
        .withMessage('level cant be empty')
        .isIn(Object.values(SkillLevel))
        .withMessage(
            `level must be one of: ${Object.values(SkillLevel).join(', ')}`,
        ),
];

export const deleteSkillValidator: ValidationChain[] = [
    resumeTemplateIdValidator[0],
    skillIdValidator[0],
];
