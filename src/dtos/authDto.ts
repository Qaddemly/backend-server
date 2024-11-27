import { userDoc } from '../models/userModel';
import { userDocument } from '../types/documentTypes';

export interface signUpBody
    extends Pick<userDoc, 'firstName' | 'lastName' | 'email' | 'password'> {
    passwordConfirm: string;
}
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
