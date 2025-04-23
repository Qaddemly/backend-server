import * as socketio from 'socket.io';
import { redisClient } from '../config/redis';
import { Logger } from '../utils/logger';
import { messageDTO } from '../dtos/messageDto';
import { ChatRepository } from '../Repository/Messaging/chatRepository';
import { Message } from '../entity/Messaging/Message';
import { MessageRepository } from '../Repository/Messaging/messageRepository';
import { MessageSentStatus } from '../enums/messageSentStatus';

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
            // TODO: Emit to business that message is deliverd
            const unDeliveredMessages =
                await MessageRepository.createQueryBuilder('message')
                    .where('message.account_id = :userId', { userId })
                    .andWhere('message.is_delivered = false')
                    .getMany();

            // TODO: we need to emit chat as whole not each message
            const deliverdChats = {};

            for (const message of unDeliveredMessages) {
                message.is_delivered = true;
                // For Each Message, we need to send an event to business, that message have been delivered
                if (!deliverdChats[message.chat_id]) {
                    socket
                        .to(`business_${message.business_id}`)
                        .emit('user_delivered_message', {
                            chatId: message.chat_id,
                            userId: message.account_id,
                            businessId: message.business_id,
                        });
                    deliverdChats[message.chat_id] = true;
                }
                await MessageRepository.save(message);
            }

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
            message.account_id = messageDTO.userId;
            message.business_id = messageDTO.businessId;
            message.sent_status = MessageSentStatus.USER;
            // Send the message to the business (broadcast to all users in the business)
            socket
                .to(`business_${messageDTO.businessId}`)
                .emit('user_send_message', {
                    ...messageDTO,
                });

            const sockets = await chatNamespace
                .in(`business_${messageDTO.businessId}`)
                .fetchSockets();

            if (sockets.length > 0) {
                message.is_delivered = true;
            }

            await MessageRepository.save(message);
        });

        socket.on(
            'user_message_seen',
            async (userMakeItSeenDTO: {
                chatId: number;
                userId: number;
                businessId: number;
            }) => {
                // Emit to business broadcast that message is seen
                // make it emit chat as a whole, like user seen chat (not each message)
                socket
                    .to(`business_${userMakeItSeenDTO.businessId}`)
                    .emit('user_message_seen', {
                        ...userMakeItSeenDTO,
                    });

                const { chatId, userId } = userMakeItSeenDTO;
                const message = await MessageRepository.createQueryBuilder(
                    'message',
                )
                    .where('message.chat_id = :chatId', { chatId })
                    .andWhere('message.account_id = :userId', { userId })
                    .andWhere('message.is_seen = false')
                    .getMany();

                message.forEach(async (msg) => {
                    msg.is_seen = true;
                    await MessageRepository.save(msg);
                });
            },
        );

        socket.on(
            'connect_user_in_business',
            async (connectUserBusinessDTO: {
                businessId: number;
                userId: number;
            }) => {
                // TODO: emit to users that message is delivered

                const { businessId, userId } = connectUserBusinessDTO;

                // We need to join or create a room (Broadcast) for the business users
                socket.join(`business_${businessId}`);
                Logger.info(
                    `User ${userId} joined business ${businessId} room`,
                );

                const connectedUsers = await chatNamespace
                    .in(`business_${businessId}`)
                    .fetchSockets();

                // Means this is the first user, so make all messages deliverd

                if (connectedUsers.length === 1) {
                    const unDeliveredMessages =
                        await MessageRepository.createQueryBuilder('message')
                            .where('message.business_id = :businessId', {
                                businessId,
                            })
                            .andWhere('message.is_delivered = false')
                            .getMany();

                    const unDeliveredChats = {};

                    for (const message of unDeliveredMessages) {
                        message.is_delivered = true;
                        if (unDeliveredChats[message.chat_id] !== true) {
                            const userSocket = await redisClient.get(
                                `User ${message.account_id} Socket`,
                            );

                            const userSocketId =
                                chatNamespace.sockets.get(userSocket);
                            if (userSocketId) {
                                userSocketId.emit(
                                    'business_delivered_message',
                                    {
                                        chatId: message.chat_id,
                                        userId: message.account_id,
                                        businessId: message.business_id,
                                    },
                                );
                            }
                            unDeliveredChats[message.chat_id] = true;
                        }

                        await MessageRepository.save(message);
                    }
                }
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
            message.account_id = messageDTO.userId;
            message.business_id = messageDTO.businessId;
            message.sent_status = MessageSentStatus.BUSINESS;
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

        socket.on(
            'business_seen_message',
            async (businessMakeItSeenDTO: {
                chatId: number;
                userId: number;
                businessId: number;
            }) => {
                const userSocketId = await redisClient.get(
                    `User ${businessMakeItSeenDTO.userId} Socket`,
                );
                const userSocket = chatNamespace.sockets.get(userSocketId);
                if (userSocket) {
                    userSocket.emit('business_seen_message', {
                        ...businessMakeItSeenDTO,
                    });
                }

                const messages = await MessageRepository.createQueryBuilder(
                    'message',
                )
                    .where('message.chat_id = :chatId', {
                        chatId: businessMakeItSeenDTO.chatId,
                    })
                    .andWhere('message.business_id = :businessId', {
                        businessId: businessMakeItSeenDTO.businessId,
                    })
                    .andWhere('message.is_seen = false')
                    .getMany();
                messages.forEach(async (msg) => {
                    msg.is_seen = true;
                    await MessageRepository.save(msg);
                });
            },
        );

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};
