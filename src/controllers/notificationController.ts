import { Request, response, Response } from 'express';
import { redisClient } from '../config/redis';
import { Job } from '../entity/Job/Job';
import { FollowBusinessRepository } from '../Repository/General/followBusinessRepository';
import { Notification } from '../models/notificationModel';
import { NotificationType } from '../enums/notification';
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
