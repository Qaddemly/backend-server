import * as socketio from 'socket.io';
import { redisClient } from '../config/redis';
import { Logger } from '../utils/logger';
import { messageDTO } from '../dtos/messageDto';
import { ChatRepository } from '../Repository/Messaging/chatRepository';
import { Message } from '../entity/Messaging/Message';
import { MessageRepository } from '../Repository/Messaging/messageRepository';

export const SocketService = (server: any) => {
    const io = new socketio.Server(server, {
        cors: {
            origin: true,
            credentials: true,
            optionsSuccessStatus: 200,
        },
    });
    const chatNamespace = io.of('/chat');

    chatNamespace.on('connection', async (socket) => {
        socket.on('connect_user', async (userId) => {
            // TODO: Make All Unread Messages as delivered

            try {
                await redisClient.set(`User ${userId} Socket`, `${socket.id}`);
                Logger.info(`${userId} Connected to server on ${socket.id}`);
            } catch (e) {
                Logger.error(`Error saving user socket id in redis`);
            }
        });
        /**
         * This Event is used to send a user message to business
         * FROM USER -->> BUSINESS (broadcast to all users in the business)
         *
         */
        socket.on('user_send_message', async (messageDTO: messageDTO) => {
            // TODO: Cache this chat
            const chat = await ChatRepository.findOneBy({
                id: messageDTO.chatId,
            });

            if (!chat) {
                Logger.error(`Chat not found`);
                return;
            }
            const message = new Message();
            message.chat = chat;
            message.content = messageDTO.content;

            // Send the message to the business (broadcast to all users in the business)
            socket
                .to(`business_${messageDTO.businessId}`)
                .emit('user_send_message', {
                    ...messageDTO,
                });

            const sockets = await chatNamespace
                .in(`business_${messageDTO.businessId}`)
                .fetchSockets();

            console.log(sockets);

            if (sockets.length > 0) {
                message.is_delivered = true;
            }

            await MessageRepository.save(message);
        });

        socket.on(
            'user_message_delivered',
            async (messageDTO: messageDTO) => {},
        );
        socket.on('user_message_seen', async (messageDTO: messageDTO) => {});

        socket.on(
            'connect_user_in_business',
            async (connectUserBusinessDTO: {
                businessId: number;
                userId: number;
            }) => {
                const { businessId, userId } = connectUserBusinessDTO;
                // We need to join or create a room (Broadcast) for the business users
                socket.join(`business_${businessId}`);
                Logger.info(
                    `User ${userId} joined business ${businessId} room`,
                );
            },
        );
        socket.on('business_send_message', async (messageDTO: messageDTO) => {
            const chat = await ChatRepository.findOneBy({
                id: messageDTO.chatId,
            });
            if (!chat) {
                Logger.error(`Chat not found`);
                return;
            }
            const message = new Message();
            message.chat = chat;
            message.content = messageDTO.content;

            const userSocketId = await redisClient.get(
                `User ${messageDTO.userId} Socket`,
            );
            const userSocket = chatNamespace.sockets.get(userSocketId);
            if (userSocket) {
                message.is_delivered = true;
                userSocket.emit('business_send_message', {
                    ...messageDTO,
                });
            }

            await MessageRepository.save(message);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};
