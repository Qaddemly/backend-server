"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const language_1 = require("../enums/language");
const country_1 = require("../enums/country");
const locationType_1 = require("../enums/locationType");
const employmentType_1 = require("../enums/employmentType");
const countryCode_1 = require("../enums/countryCode");
const phoneSchema = new mongoose.Schema({
    countryCode: {
        type: Number,
        enum: countryCode_1.CountryCode,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
});
const addressSchema = new mongoose.Schema({
    country: {
        type: String,
        enum: country_1.Country,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
});
const educationSchema = new mongoose.Schema({
    university: {
        type: String,
        required: true,
    },
    fieldOfStudy: {
        type: String,
        required: true,
    },
    gpa: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
});
const experienceSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    employmentType: {
        type: String,
        enum: employmentType_1.EmploymentType,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    locationType: {
        type: String,
        enum: locationType_1.LocationType,
        required: true,
    },
    stillWorking: {
        type: Boolean,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: false,
    },
});
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        required: [true, 'Email address is required'],
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    phone: {
        type: phoneSchema,
    },
    address: {
        type: addressSchema,
    },
    dateOfBirth: {
        type: Date,
    },
    profilePicture: {
        type: String,
    },
    education: {
        type: educationSchema,
    },
    experience: {
        type: [experienceSchema],
    },
    skills: {
        type: [String],
    },
    languages: {
        type: [String],
        enum: Object.values(language_1.Language),
    },
    resume: {
        type: String,
    },
}, {
    timestamps: true,
});
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
const User = mongoose.model('User', userSchema);
exports.default = User;
