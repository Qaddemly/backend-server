import nodemailer from 'nodemailer';
import { mailOptions, nodemailerMailOptions } from '../types/email';
import { userDocument, UserType } from '../types/documentTypes';
import { NextFunction } from 'express';
import AppError from './appError';
import { resettingUserCodeFields } from './codeUtils';

export const sendMail = async (options: mailOptions) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
    const opt: nodemailerMailOptions = {
        from: `E-shop <${process.env.GMAIL_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    await transporter.sendMail(opt);
};

export const sendingCodeToEmail = async (
    email: string,
    subject: string,
    message: string,
) => {
    await sendMail({
        email: email,
        subject: subject,
        message: message,
    });
};
