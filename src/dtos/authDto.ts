import { userDoc } from '../models/userModel';
import { userDocument } from '../types/documentTypes';

export interface signUpBody
    extends Pick<userDoc, 'firstName' | 'lastName' | 'email' | 'password'> {
    passwordConfirm: string;
}
export interface signUpBodyStepTwoDTO
    extends Pick<
        userDoc,
        | 'address'
        | 'phone'
        | 'skills'
        | 'experience'
        | 'dateOfBirth'
        | 'education'
        | 'languages'
        | 'profilePicture'
        | 'resume'
    > {}

export interface updateMeBody
    extends Pick<
        userDoc,
        | 'address'
        | 'phone'
        | 'skills'
        | 'experience'
        | 'dateOfBirth'
        | 'education'
        | 'languages'
        | 'profilePicture'
        | 'firstName'
        | 'lastName'
        | 'email'
        | 'resume'
    > {}
export interface activateEmailBody {
    code: string;
}
export type activateEmailParams = {
    activationToken: string;
};
export type verifyResetCodeParams = {
    resetActivationToken: string;
};
export interface verifyResetCodeBody extends activateEmailBody {}
export type resetPasswordParams = {
    passwordResetToken: string;
};
export interface resetPasswordBody {
    newPassword: string;
    newPasswordConfirm: string;
}

export interface logInBody extends Pick<userDoc, 'email' | 'password'> {}
export interface forgetPasswordBody extends Pick<userDoc, 'email'> {}

export interface changeMyPasswordBody {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}
