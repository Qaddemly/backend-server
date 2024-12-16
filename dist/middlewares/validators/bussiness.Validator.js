"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessUpdateValidator = exports.businessCreationValidator = void 0;
var express_validator_1 = require("express-validator");
var country_1 = require("../../enums/country");
var locationType_1 = require("../../enums/locationType");
exports.businessCreationValidator = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty()
        .withMessage('name cannot be empty')
        .isLength({ min: 3 })
        .withMessage('name must be at least 3 characters')
        .isLength({ max: 32 })
        .withMessage('name must be at most 32 characters'),
    (0, express_validator_1.body)('logo').notEmpty().withMessage('logo cannot be empty'),
    (0, express_validator_1.body)('CEO')
        .trim()
        .notEmpty()
        .withMessage('CEO cannot be empty')
        .isAlpha()
        .withMessage('CEO must be a string of alphabets'),
    (0, express_validator_1.body)('founder')
        .trim()
        .notEmpty()
        .withMessage('founder cannot be empty')
        .isLength({ min: 3 })
        .withMessage('founder at least 3 characters '),
    (0, express_validator_1.body)('founded')
        .notEmpty()
        .withMessage('founded is required')
        .isDate()
        .withMessage('founded must be Date'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('description cannot be empty')
        .isLength({ min: 20 })
        .withMessage('description must be at least 20 characters'),
    (0, express_validator_1.body)('location_type')
        .notEmpty()
        .withMessage('location_type is required')
        .custom(function (val) {
        if (val in locationType_1.LocationType) {
            return val;
        }
        else
            throw new Error('inValid location_type ');
    }),
    (0, express_validator_1.body)('company_size')
        .notEmpty()
        .withMessage('company_size is required')
        .isInt()
        .withMessage('company_size must be an integer'),
    (0, express_validator_1.body)('industry')
        .trim()
        .notEmpty()
        .withMessage('industry is required')
        .isLength({ min: 5 })
        .withMessage('industry at least 5 characters'),
    (0, express_validator_1.body)('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('invalid website url'),
    (0, express_validator_1.body)('headquarter')
        .trim()
        .notEmpty()
        .withMessage('headquarter is required')
        .isLength({ min: 3 })
        .withMessage('headquarter at least 3 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('invalid email address'),
    (0, express_validator_1.body)('address').optional().isObject(),
    (0, express_validator_1.body)('address.country')
        .if((0, express_validator_1.body)('address').exists())
        .trim()
        .notEmpty()
        .withMessage('Country cannot be empty')
        .custom(function (value) {
        if (value in country_1.Country)
            return value;
        else
            throw new Error('Country Name is invalid (not in the country list)');
    }),
    (0, express_validator_1.body)('address.city')
        .if((0, express_validator_1.body)('address').exists())
        .trim()
        .notEmpty()
        .withMessage('City cannot be empty')
        .isAlpha()
        .withMessage('City must be a string of alphabets'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isObject()
        .isMobilePhone(['any'])
        .withMessage('invalid phone number'),
];
exports.businessUpdateValidator = [
    (0, express_validator_1.body)('name')
        .trim()
        .optional()
        .isLength({ min: 3 })
        .withMessage('name must be at least 3 characters')
        .isLength({ max: 32 })
        .withMessage('name must be at most 32 characters'),
    (0, express_validator_1.body)('logo').notEmpty().withMessage('logo cannot be empty'),
    (0, express_validator_1.body)('CEO')
        .trim()
        .optional()
        .isAlpha()
        .withMessage('CEO must be a string of alphabets'),
    (0, express_validator_1.body)('founder')
        .trim()
        .optional()
        .isLength({ min: 3 })
        .withMessage('founder at least 3 characters '),
    (0, express_validator_1.body)('founded').optional().isDate().withMessage('founded must be Date'),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ min: 20 })
        .withMessage('description must be at least 20 characters'),
    (0, express_validator_1.body)('location_type')
        .optional()
        .custom(function (val) {
        if (val in locationType_1.LocationType) {
            return val;
        }
        else
            throw new Error('inValid location_type ');
    }),
    (0, express_validator_1.body)('company_size')
        .optional()
        .isInt()
        .withMessage('company_size must be an integer'),
    (0, express_validator_1.body)('industry')
        .optional()
        .trim()
        .isLength({ min: 5 })
        .withMessage('industry at least 5 characters'),
    (0, express_validator_1.body)('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('invalid website url'),
    (0, express_validator_1.body)('headquarter')
        .optional()
        .isLength({ min: 5 })
        .withMessage('headquarter at least 5 characters'),
    (0, express_validator_1.body)('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('invalid email address'),
    (0, express_validator_1.body)('address').optional().isObject(),
    (0, express_validator_1.body)('address.country')
        .if((0, express_validator_1.body)('address').exists())
        .trim()
        .notEmpty()
        .withMessage('Country cannot be empty')
        .custom(function (value) {
        if (value in country_1.Country)
            return value;
        else
            throw new Error('Country Name is invalid (not in the country list)');
    }),
    (0, express_validator_1.body)('address.city')
        .if((0, express_validator_1.body)('address').exists())
        .trim()
        .notEmpty()
        .withMessage('City cannot be empty')
        .isAlpha()
        .withMessage('City must be a string of alphabets'),
    (0, express_validator_1.body)('phone')
        .optional()
        .isObject()
        .isMobilePhone(['any'])
        .withMessage('invalid phone number'),
];
//# sourceMappingURL=bussiness.Validator.js.map