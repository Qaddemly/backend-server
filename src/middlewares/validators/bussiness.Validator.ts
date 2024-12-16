import { body, ValidationChain } from 'express-validator';

import { Country } from '../../enums/country';
import { LocationType } from '../../enums/locationType';
import { HrRole } from '../../enums/HrRole';
import { CountryCode } from '../../enums/countryCode';
export const businessCreationValidator: ValidationChain[] = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('name cannot be empty')
        .isLength({ min: 3 })
        .withMessage('name must be at least 3 characters')
        .isLength({ max: 32 })
        .withMessage('name must be at most 32 characters'),
    body('logo').notEmpty().withMessage('logo cannot be empty'),
    body('CEO').trim().notEmpty().withMessage('CEO cannot be empty'),
    body('founder')
        .trim()
        .notEmpty()
        .withMessage('founder cannot be empty')
        .isLength({ min: 3 })
        .withMessage('founder at least 3 characters '),
    body('founded')
        .notEmpty()
        .withMessage('founded is required')
        .isDate()
        .withMessage('founded must be Date'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('description cannot be empty')
        .isLength({ min: 20 })
        .withMessage('description must be at least 20 characters'),
    body('location_type')
        .notEmpty()
        .withMessage('location_type is required')
        .custom((val) => {
            if (val in LocationType) {
                return val;
            } else throw new Error('inValid location_type ');
        }),
    body('company_size')
        .notEmpty()
        .withMessage('company_size is required')
        .isInt()
        .withMessage('company_size must be an integer'),
    body('industry')
        .trim()
        .notEmpty()
        .withMessage('industry is required')
        .isLength({ min: 2 })
        .withMessage('industry at least 5 characters'),
    body('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('invalid website url'),
    body('headquarter')
        .trim()
        .notEmpty()
        .withMessage('headquarter is required')
        .isLength({ min: 3 })
        .withMessage('headquarter at least 3 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('invalid email address'),
    body('address').optional().isObject(),
    body('address.country')
        .if(body('address').exists())
        .trim()
        .notEmpty()
        .withMessage('Country cannot be empty')
        .custom((value) => {
            if (value in Country) return value;
            else
                throw new Error(
                    'Country Name is invalid (not in the country list)',
                );
        }),
    body('address.city')
        .if(body('address').exists())
        .trim()
        .notEmpty()
        .withMessage('City cannot be empty')
        .isAlpha()
        .withMessage('City must be a string of alphabets'),
    body('phone').optional().isArray(),
    body('phone.*')
        .if(body('phone').exists())
        .isObject()
        .withMessage('phone must be an object'),
    body('phone.*.country_code')
        .if(body('phone').exists())
        .trim()
        .notEmpty()
        .withMessage('Country Code cannot be empty')
        .custom((value) => {
            if (value in CountryCode) return value;
            else throw new Error('Country Code is invalid');
        }),
    body('phone.*.number')
        .if(body('phone').exists())
        .trim()
        .notEmpty()
        .withMessage('Phone number cannot be empty')
        .isNumeric()
        .withMessage('Phone number must be a number'),
];
export const businessUpdateValidator: ValidationChain[] = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('name must be at least 3 characters')
        .isLength({ max: 32 })
        .withMessage('name must be at most 32 characters'),
    body('logo').optional().notEmpty().withMessage('logo cannot be empty'),
    body('CEO').trim().notEmpty().withMessage('CEO cannot be empty'),
    body('founder')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('founder at least 3 characters '),
    body('founded').optional().isDate().withMessage('founded must be Date'),
    body('description')
        .optional()
        .isLength({ min: 20 })
        .withMessage('description must be at least 20 characters'),
    body('location_type')
        .optional()
        .custom((val) => {
            if (val in LocationType) {
                return val;
            } else throw new Error('inValid location_type ');
        }),
    body('company_size')
        .optional()
        .isInt()
        .withMessage('company_size must be an integer'),
    body('industry')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('industry at least 5 characters'),
    body('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('invalid website url'),
    body('headquarter')
        .optional()
        .isLength({ min: 5 })
        .withMessage('headquarter at least 5 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('invalid email address'),
    body('address').optional().isObject(),
    body('address.country')
        .if(body('address').exists())
        .trim()
        .notEmpty()
        .withMessage('Country cannot be empty')
        .custom((value) => {
            if (value in Country) return value;
            else
                throw new Error(
                    'Country Name is invalid (not in the country list)',
                );
        }),
    body('address.city')
        .if(body('address').exists())
        .trim()
        .notEmpty()
        .withMessage('City cannot be empty')
        .isAlpha()
        .withMessage('City must be a string of alphabets'),
];

export const checkAddNewHrValidator: ValidationChain[] = [
    body('account_email').trim().isEmail().withMessage('invalid email address'),
    body('role').custom((val) => {
        if (val in HrRole) {
            return val;
        } else {
            throw new Error('invalid role');
        }
    }),
];
