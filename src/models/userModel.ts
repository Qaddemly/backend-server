import * as mongoose from 'mongoose';

import { Address, Education, Experience, Phone } from '../types/types';
import { Language } from '../enums/language';
import { Country } from '../enums/country';
import { LocationType } from '../enums/locationType';
import { EmploymentType } from '../enums/employmentType';
import { CountryCode } from '../enums/countryCode';

export interface userDoc extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: Phone;
    address?: Address;
    dateOfBirth?: Date;
    profilePicture?: string;
    education?: Education;
    experience?: Experience[];
    skills?: string[];
    languages?: Language[];
    resume?: string;
    activationCode?: string;
    activationCodeExpiresIn?: Date;
    activationToken?: string;
    passwordChangedAt?: Date;
    passwordResetCode?: string;
    passwordResetCodeExpires?: Date;
    passwordResetVerificationToken?: string;
    passwordResetToken?: string;
    googleId?: string;
    role?: string;
    active?: boolean;
    expireAt?: boolean;
    isActivated?: boolean;
    refreshTokens: string[];
}

const phoneSchema = new mongoose.Schema<Phone>({
    countryCode: {
        type: Number,
        enum: CountryCode,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
});

const addressSchema = new mongoose.Schema<Address>({
    country: {
        type: String,
        enum: Country,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
});

const educationSchema = new mongoose.Schema<Education>({
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
        min: 0,
        max: 4,
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

const experienceSchema = new mongoose.Schema<Experience>({
    jobTitle: {
        type: String,
        required: true,
    },
    employmentType: {
        type: String,
        enum: EmploymentType,
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
        enum: LocationType,
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

const userSchema = new mongoose.Schema<userDoc>(
    {
        email: {
            type: String,
            index: true,
            unique: true,
            trim: true,
            required: [true, 'Email address is required'],
            match: [
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please fill a valid email address',
            ],
        },
        firstName: {
            type: String,
            trim: true,
            required: [true, 'First name is required'],
        },
        lastName: {
            type: String,
            trim: true,
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
        // languages: {
        //     type: [AccountLanguage],
        // },
        resume: {
            type: String,
        },
        passwordChangedAt: Date,
        passwordResetCode: String,
        passwordResetCodeExpires: Date,
        passwordResetVerificationToken: String,
        passwordResetToken: String,
        googleId: String,
        role: {
            type: String,
            default: 'seeker',
            enum: ['seeker', 'admin', 'manager'],
        },
        active: {
            type: Boolean,
            default: true,
        },

        isActivated: {
            type: Boolean,
            default: false,
        },
        refreshTokens: [String],
        activationCode: String,
        activationCodeExpiresIn: Date,
        activationToken: String,
    },
    {
        timestamps: true,
    },
);

userSchema.virtual('fullName').get(function (this: userDoc) {
    return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model<userDoc>('User', userSchema);

export default User;
