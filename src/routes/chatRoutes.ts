import express from 'express';
import { protect } from '../services/authServices';

import * as chatController from '../controllers/chatController';

export const chatRouter = express.Router();

chatRouter.post('/user/createChat', protect, chatController.createChat);

chatRouter.get(
    '/user/getAllUserChats',
    protect,
    chatController.getAllChatsOfUser,
);
chatRouter.get(
    '/user/getAllMessages/:chatId',
    protect,
    chatController.getMessagesOfChatOfUser,
);

chatRouter.get(
    '/business/getAllBusinessChats/:businessId',
    protect,
    chatController.checkBusinessAuthorization,
    chatController.getAllChatsOfBusiness,
);

// chatRouter.get(
//     '/business/getAllMessages/:chatId',
//     protect,
//     chatController.getAllMessagesOfBusinessChat,
// );

// chatRouter.get(
//     '/business/getAllMessages/:chatId',
//     protect,
//     chatController.getAllMessagesOfChat,
// );
