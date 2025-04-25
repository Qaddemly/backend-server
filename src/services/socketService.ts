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
            if (!userId) {
                Logger.error(`User ID not found`);
                socket.emit('error_connect_user', {
                    message: 'User ID not found',
                });
                return;
            }
            if (typeof userId !== 'number') {
                Logger.error(`User ID is not a number`);
                socket.emit('error_connect_user', {
                    message: 'User ID is not a number',
                });
                return;
            }

            // TODO: Emit to business that message is deliverd
            const unDeliveredMessages =
                await MessageRepository.createQueryBuilder('message')
                    .where('message.account_id = :userId', { userId })
                    .andWhere('message.is_delivered = false')
                    .andWhere('message.sent_status = :sentStatus', {
                        sentStatus: MessageSentStatus.BUSINESS,
                    })
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

            const sockets = await chatNamespace
                .in(`business_${messageDTO.businessId}`)
                .fetchSockets();

            if (sockets.length > 0) {
                message.is_delivered = true;
            }
            socket
                .to(`business_${messageDTO.businessId}`)
                .emit('user_send_message', message);

            Logger.info(
                `User ${messageDTO.userId} sent message to business ${messageDTO.businessId}`,
            );
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
                // TODO: we need to only seen messages that send by other user
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
                    .andWhere('message.sent_status = :sentStatus', {
                        sentStatus: MessageSentStatus.BUSINESS,
                    })
                    .getMany();

                for (const msg of message) {
                    msg.is_seen = true;
                    await MessageRepository.save(msg);
                }

                Logger.info(
                    `User ${userId} seen message in chat ${chatId} for business ${userMakeItSeenDTO.businessId}`,
                );
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
                            .andWhere('message.sent_status = :sentStatus', {
                                sentStatus: MessageSentStatus.USER,
                            })
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
                userSocket.emit('business_send_message', message);
            }
            Logger.info(
                `Business ${messageDTO.businessId} sent message to user ${messageDTO.userId}`,
            );
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
                    .andWhere('message.sent_status = :sentStatus', {
                        sentStatus: MessageSentStatus.USER,
                    })
                    .getMany();

                for (const msg of messages) {
                    msg.is_seen = true;
                    await MessageRepository.save(msg);
                }

                Logger.info(
                    `Business ${businessMakeItSeenDTO.businessId} seen message in chat ${businessMakeItSeenDTO.chatId} for user ${businessMakeItSeenDTO.userId}`,
                );
            },
        );
        socket.on('user_disconnect', async (userId: number) => {
            try {
                await redisClient.del(`User ${userId} Socket`);
                Logger.info(`User ${userId} disconnected from server`);
            } catch (e) {
                Logger.error(`Error deleting user socket id in redis`);
            }
            socket.disconnect();
        });
        socket.on(
            'user_disconnect_from_business',
            async (userId: number, businessId: number) => {
                socket.leave(`business_${businessId}`);
                socket.disconnect();
            },
        );
        socket.on('disconnect', async () => {
            Logger.info(`User disconnected from server`);
            socket.disconnect();
        });
    });

    return io;
};
