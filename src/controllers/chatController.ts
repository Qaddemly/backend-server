import { NextFunction, Request, Response } from 'express';
import catchAsync from 'express-async-handler';

import * as chatService from '../services/chatServices';
import { createChatDTO } from '../dtos/chatDto';
import AppError from '../utils/appError';
import { HrEmployeeRepository } from '../Repository/Business/hrEmployeeRepository';
import { HrRole } from '../enums/HrRole';

export const getAllChatsOfUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const chats = await chatService.getAllChatsOfUser(req.user.id);
        res.status(200).json({
            success: true,
            chats,
        });
    },
);

export const getMessagesOfChatOfUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const page = Number(req.query.page) || 1;
        const chatId = Number(req.params.chatId);
        const messages = await chatService.getMessagesOfChatOfUser(
            req.user.id,
            chatId,
            page,
        );
        res.status(200).json({
            success: true,
            messages,
        });
    },
);

export const checkBusinessAuthorization = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const accountId = req.user.id;
        const businessId = req.params.businessId;
        const hr = await HrEmployeeRepository.findOneBy({
            account_id: accountId,
            business_id: Number(businessId),
        });
        if (!hr) {
            return next(
                new AppError(
                    'You are not authorized to access this business',
                    401,
                ),
            );
        }
        if (hr.role !== HrRole.OWNER && hr.role !== HrRole.SUPER_ADMIN) {
            return next(
                new AppError(
                    'You are not authorized to access this business',
                    401,
                ),
            );
        }
        next();
    },
);

export const getAllChatsOfBusiness = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const businessId = Number(req.params.businessId);
        const chats = await chatService.getAllChatsOfBusiness(businessId);
        res.status(200).json({
            success: true,
            chats,
        });
    },
);

export const createChat = catchAsync(
    async (
        req: Request<{}, {}, createChatDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        const { businessId } = req.body;
        if (req.user.id !== req.body.accountId) {
            throw new AppError(
                'Account Id is not authorized to create chat',
                401,
            );
        }
        const chat = await chatService.createChat(
            Number(businessId),
            Number(req.body.accountId),
        );
        res.status(200).json({
            success: true,
            chat,
        });
    },
);
