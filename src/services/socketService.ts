import * as socketio from 'socket.io';
import { redisClient } from '../config/redis';
import { Logger } from '../utils/logger';
import { messageDTO } from '../dtos/messageDto';

export const SocketService = (server: any) => {
    const io = new socketio.Server(server, {
        cors: {
            origin: true,
            credentials: true,
            optionsSuccessStatus: 200,
        },
    });

    io.on('connection', async (socket) => {
        socket.on('connect_user', async (userId) => {
            // When User Connect (Save it's id in redis, to broadcast to it later)
            try {
                await redisClient.set(`User ${userId} Socket`, `${socket.id}`);
                Logger.info(`${userId} Connected to server on ${socket.id}`);
            } catch (e) {
                Logger.error(`Error saving user socket id in redis`);
            }
        });

        socket.on('message', async (message: messageDTO) => {
            const receiverId = message.receiverId;
            const receiverSocketId = await redisClient.get(
                `User ${receiverId} Socket`,
            );
            console.log(receiverSocketId);
            const receiverSocket = io.sockets.sockets.get(receiverSocketId);
            console.log(receiverSocket);
            receiverSocket.emit('message', message);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
};
