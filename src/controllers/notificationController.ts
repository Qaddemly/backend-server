import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../config/redis';

import { Notification } from '../models/notificationModel';
import catchAsync from 'express-async-handler';
import {
    deleteUserNotificationService,
    getAllUserNotificationService,
    makeAllNotificationsSeenService,
    readNotificationService,
} from '../services/notificationServices';

export let clients = [];

export const setUpSSEevents = async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    clients.push({ res, accountId: req.query.user });
    const notifications = await Notification.find({
        accountId: Number(req.query.user),
        isSent: false,
    });
    notifications.map((notification) => {
        notification.isSent = true;
        notification.save();
        res.write(`data: ${JSON.stringify(notification)}\n\n`);
    });
    req.on('close', async () => {
        clients = clients.filter((client) => client.res !== res);
    });
};

async function removeClient(client) {
    const clientString = JSON.stringify(client); // Convert object to string
    await redisClient.lRem('clients', 1, clientString); // Remove one matching entry
    console.log('Client removed!');
}

export const getAllUserNotifications = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const notifications =
                await getAllUserNotificationService(accountId);
            res.status(200).json({
                success: true,
                message: 'notifications fetched successfully',
                notifications,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const readNotification = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const notificationId = req.params.id;
            const notification = await readNotificationService(
                notificationId,
                accountId,
            );
            res.status(200).json({
                success: true,
                message: 'notification read successfully',
                notification,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export const deleteUserNotification = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const notificationId = req.params.id;
            await deleteUserNotificationService(notificationId, accountId);
            res.status(204).json({});
        } catch (err) {
            return next(err);
        }
    },
);

export const makeAllNotificationsSeen = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const accountId = Number(req.user.id);
            const seenNotifications =
                await makeAllNotificationsSeenService(accountId);
            res.status(200).json({
                success: true,
                message: 'notifications seen successfully ',
            });
        } catch (err) {
            return next(err);
        }
    },
);
