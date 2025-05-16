import { Response } from 'express';
import { redisClient } from '../config/redis';
import { Job } from '../entity/Job/Job';
import { NotificationType } from '../enums/notification';
import { Notification } from '../models/notificationModel';
import { FollowBusinessRepository } from '../Repository/General/followBusinessRepository';
import { clients } from '../controllers/notificationController';
import AppError from '../utils/appError';
import { BusinessRepository } from '../Repository/Business/businessRepository';
import { AccountRepository } from '../Repository/Account/accountRepository';
import { HrRole } from '../enums/HrRole';
import { NotificationMessageType } from '../types/types';
import { Message } from '../entity/Messaging/Message';
// async function getClientsList() {
//     const clientStrings = await redisClient.lRange('clients', 0, -1); // Get all items
//     return clientStrings.map((client) => JSON.parse(client)); // Convert JSON to object
// }
export const sendJobNotification = async (job: Job) => {
    //1- get all account that follow business that post job
    const follows = await FollowBusinessRepository.find({
        where: { business_id: job.business_id },
    });
    //2- create notification for each account

    const onlineClients: { [key: string]: any } = {};
    for (const client of clients) {
        onlineClients[`${client.accountId}`] = client;
    }
    const receiveNotesClients: { [key: string]: any } = {};
    //console.log(onlineClients);
    const notifications = follows.map((follow) => {
        let isSent = false;
        if (
            follow.account_id ==
            onlineClients[`${follow.account_id}`]?.accountId
        ) {
            isSent = true;
        }
        const newNotification = new Notification({
            type: NotificationType.JobPosted,
            message: `New job posted: ${job.title} on business ${job.business.name}`,
            jobId: job.id,
            businessId: job.business_id,
            accountId: follow.account_id,
            isSent,
        });
        if (isSent) {
            receiveNotesClients[`${follow.account_id}`] = {
                ...onlineClients[`${follow.account_id}`],
                notification: newNotification,
            };
        }
        return newNotification;
    });
    console.log(receiveNotesClients);
    Object.values(receiveNotesClients).forEach((value) => {
        value.res.write(`data: ${JSON.stringify(value.notification)}\n\n`);
    });

    await Notification.insertMany(notifications);
    //console.log(onlineClients);

    // for (const follow of follows) {
    //     const newNotification = await Notification.create({
    //         type: NotificationType.JobPosted,
    //         message: `New job posted: ${job.title} on business ${job.business.name}`,
    //         jobId: job.id,
    //         businessId: job.business_id,
    //         accountId: follow.account_id,
    //     });
    //     //3- broadcast notification to all connected clients
    //     for (const client of clients) {
    //         if (follow.account_id == Number(client.accountId)) {
    //             newNotification.isSent = true;
    //             await newNotification.save();
    //             client.res.write(
    //                 `data: ${JSON.stringify(newNotification)}\n\n`,
    //             );
    //             break;
    //         }
    //     }
    // }
};

export const sendJobApplicationUpdateNotification = async (
    notificationData: any,
) => {
    console.log('hello from sending notifications custom job app0li');
    const newNotification = await Notification.create({
        type: NotificationType.JobApplicationStatusUpdated,
        message: `update on your job application on job ${notificationData.job.title} posted on business ${notificationData.business.name} with state ${notificationData.state}`,
        jobId: notificationData.job.id,
        businessId: notificationData.business.id,
        accountId: notificationData.account_id,
        jobApplicationId: notificationData.id,
    });
    const client = clients.find(
        (c) => Number(c.accountId) == notificationData.account_id,
    );
    if (client) {
        newNotification.isSent = true;
        await newNotification.save();
        client.res.write(`data: ${JSON.stringify(newNotification)}\n\n`);
    }
};

export const sendMessageToBusiness = async (notificationData: Message) => {
    console.log('sending message to business');
    const onlineClients: { [key: string]: any } = {};
    for (const client of clients) {
        onlineClients[`${client.accountId}`] = client;
    }
    const accounts = await AccountRepository.createQueryBuilder('account')
        .innerJoin('account.business_roles', 'hrEmployee')
        .where('hrEmployee.business_id = :businessId', {
            businessId: notificationData.business_id,
        })
        .andWhere('hrEmployee.role IN (:...roles)', {
            roles: [HrRole.OWNER, HrRole.SUPER_ADMIN],
        })
        .getMany();
    //console.log('accounts', accounts);
    const senderAccount = await AccountRepository.findOne({
        where: { id: notificationData.account_id },
    });
    const business = await BusinessRepository.findOne({
        where: { id: notificationData.business_id },
    });
    accounts.map(async (account) => {
        const newNotification = await Notification.create({
            type: NotificationType.MessageSentToBusiness,
            message: `${senderAccount?.first_name} ${senderAccount?.last_name} send message ${notificationData.content} to your business ${business?.name}`,
            businessId: notificationData.business_id,
            accountId: account.id,
            userSenderId: senderAccount.id,
            chatId: notificationData.chat.id,
        });
        await newNotification.save();
        const client = onlineClients[account.id];
        if (client) {
            newNotification.isSent = true;
            await newNotification.save();
            const sentNotification: { [key: string]: any } = {
                ...newNotification.toObject(),
                userSender: senderAccount,
            };

            client.res.write(`data: ${JSON.stringify(sentNotification)}\n\n`);
        }
    });
};

export const getAllUserNotificationService = async (account_id: number) => {
    const notifications = await Notification.find({ accountId: account_id });
    const businessIds = notifications.map((n) => n.businessId);
    const businesses = await BusinessRepository.findByIds(businessIds);
    const businessMap = new Map();
    businesses.forEach((business) => businessMap.set(business.id, business));

    const enrichedNotifications = notifications.map((notification) => ({
        ...notification.toObject(),
        business: businessMap.get(notification.businessId) || undefined, // Attach business data
    }));

    return enrichedNotifications;
};

export const getOneUserNotificationService = async (
    notificationId: string,
    account_id: number,
) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        accountId: account_id,
    });
    if (!notification) {
        throw new AppError('notification not found', 404);
    }
    return notification;
};

export const deleteUserNotificationService = async (
    notificationId: string,
    account_id: number,
) => {
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        accountId: account_id,
    });
    if (!notification) {
        throw new AppError('notification not found', 404);
    }
    return notification;
};

export const readNotificationService = async (
    id: string,
    accountId: number,
) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: id, accountId },
        {
            isRead: true,
            isSeen: true,
        },
        { new: true },
    );
    if (!notification) {
        throw new AppError('notification not found', 404);
    }
    return notification;
};

export const makeAllNotificationsSeenService = async (accountId: number) => {
    const notifications = await Notification.updateMany(
        { accountId: accountId, isSeen: false },
        { isSeen: true },
    );
    return notifications;
};
export const makeAllNotificationsReadService = async (accountId: number) => {
    const notifications = await Notification.updateMany(
        { accountId: accountId, isRead: false },
        { isRead: true, isSeen: true },
    );
    return notifications;
};
