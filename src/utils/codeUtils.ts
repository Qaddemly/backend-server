import crypto from 'crypto';
import { userDocument, UserType } from '../types/documentTypes';
import { NextFunction, Response } from 'express';
import { sendingCodeToEmail } from './email';
import { AccountRepository } from '../Repository/Account/accountRepository';
// create general code for activation or resetting password
const createCode = (): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
};
// use crypto lib to encrypt password token any thing else
export const cryptoEncryption = (objective: string) => {
    return crypto.createHash('sha256').update(objective).digest('hex');
};

//used for generating activation code and adn activationToken
const generateActivationTokenAndCode = async (
    userTempData: UserType,
    email: string,
) => {
    //1- generate code
    const code = createCode();
    const hashedCode = cryptoEncryption(code);
    //3- generate activation Token
    const activationToken = `${email + code}`;
    const hashedActivationToken = cryptoEncryption(activationToken);
    //5 save token and code to userTempData
    userTempData.activationCode = hashedCode;
    userTempData.activationCodeExpiresIn = new Date(
        Date.now() + 10 * 60 * 1000,
    ); // 10 minutes
    userTempData.activationToken = hashedActivationToken;
    await userTempData.save();
    return [hashedActivationToken, code];
};

export const resettingUserCodeFields = async (userTempData: UserType) => {
    userTempData.activationCode = undefined;
    userTempData.activationCodeExpiresIn = undefined;
    userTempData.activationToken = undefined;
    userTempData.passwordResetCode = undefined;
    userTempData.passwordResetCodeExpires = undefined;
    userTempData.passwordResetVerificationToken = undefined;
    userTempData.passwordResetToken = undefined;
    userTempData.activationCode = undefined;
    await userTempData.save();
};

export const generateAnotherActivationCode = async (userTempData: UserType) => {
    const code = createCode();
    const hashedCode = cryptoEncryption(code);

    userTempData.activationCode = hashedCode;
    userTempData.activationCodeExpiresIn = new Date(
        Date.now() + 10 * 60 * 1000,
    ); // 10 minutes
    await userTempData.save();
    return code;
};

export const generateAndEmailCode = async (
    userTempData: UserType,
    email: string,
): Promise<string> => {
    const [activationToken, code]: string[] =
        await generateActivationTokenAndCode(userTempData, email);
    //3- send email to user
    const subject = 'email activation';
    const message = `your activation code is ${code}`;
    await sendingCodeToEmail(email, subject, message);
    return activationToken;
};

//used for generating activation code and adn activationToken
const generatePassResetTokenAndCode = async (
    userTempData: UserType,
    email: string,
) => {
    //1- generate code
    const code = createCode();
    const hashedCode = cryptoEncryption(code);
    //3- generate activation Token
    const activationToken = `${email + code}`;
    const hashedActivationToken = cryptoEncryption(activationToken);
    //5 save token and code to userTempData
    userTempData.passwordResetCode = hashedCode;
    userTempData.passwordResetCodeExpires = new Date(
        Date.now() + 10 * 60 * 1000,
    ); // 10 minutes
    userTempData.passwordResetVerificationToken = hashedActivationToken;
    await userTempData.save();
    return [hashedActivationToken, code];
};

export const generateAndEmailPassResetCode = async (
    userTempData: UserType,
    email: string,
) => {
    const [hashedActivationToken, code]: string[] =
        await generatePassResetTokenAndCode(userTempData, email);
    //3- send email to user
    const subject = 'password reset code';
    const message = `your password reset code is valid for (10 min) \n
  ${code}\n`;
    await sendingCodeToEmail(email, subject, message);
    return hashedActivationToken;
};

export const generateAnotherPassResetCode = async (userTempData: UserType) => {
    const code = createCode();
    const hashedCode = cryptoEncryption(code);

    userTempData.passwordResetCode = hashedCode;
    userTempData.passwordResetCodeExpires = new Date(
        Date.now() + 10 * 60 * 1000,
    ); // 10 minutes
    await userTempData.save();
    return code;
};

export const resetCodeVerified = async (
    userTempData: UserType, // User temporary data
    user: UserType, // account user
) => {
    if (!user.is_activated) {
        user.is_activated = true;
        userTempData.activationCode = undefined;
        userTempData.activationCodeExpiresIn = undefined;
        userTempData.activationToken = undefined;
    }
    const resetToken = `${user.email}+${userTempData.passwordResetVerificationToken}`;
    const passwordResetToken = cryptoEncryption(resetToken);
    userTempData.passwordResetToken = passwordResetToken;
    userTempData.passwordResetCode = undefined;
    userTempData.passwordResetCodeExpires = undefined;
    userTempData.passwordResetVerificationToken = undefined;
    await userTempData.save();
    await AccountRepository.save(user);
    return passwordResetToken;
};
