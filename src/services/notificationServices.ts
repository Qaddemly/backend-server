import { Response } from 'express';
import { redisClient } from '../config/redis';
import { Job } from '../entity/Job/Job';
import { NotificationType } from '../enums/notification';
import { Notification } from '../models/notificationModel';
import { FollowBusinessRepository } from '../Repository/General/followBusinessRepository';
import { clients } from '../controllers/notificationController';
import AppError from '../utils/appError';
import { JobApplication } from '../entity/Job/JobApplication';
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
    for (const follow of follows) {
        const newNotification = await Notification.create({
            type: NotificationType.JobPosted,
            message: `New job posted: ${job.title} on business ${job.business.name}`,
            jobId: job.id,
            businessId: job.business_id,
            accountId: follow.account_id,
        });
        //3- broadcast notification to all connected clients
        for (const client of clients) {
            if (follow.account_id == Number(client.accountId)) {
                newNotification.isSent = true;
                await newNotification.save();
                client.res.write(
                    `data: ${JSON.stringify(newNotification)}\n\n`,
                );
                break;
            }
        }
    }
};

export const sendJobApplicationUpdateNotification = async (
    jobApplication: any,
) => {
    const newNotification = await Notification.create({
        type: NotificationType.JobPosted,
        message: `update on your job application on job ${jobApplication.job.title} posted on business ${jobApplication.job.business.name} with state ${jobApplication.state}`,
        jobId: jobApplication.job.id,
        businessId: jobApplication.job.business_id,
        accountId: jobApplication.account_id,
        jobApplicationId: jobApplication.id,
    });
    const client = clients.find(
        (c) => Number(c.accountId) == jobApplication.account_id,
    );
    if (client) {
        newNotification.isSent = true;
        await newNotification.save();
        client.res.write(`data: ${JSON.stringify(newNotification)}\n\n`);
    }
};

export const getAllUserNotifications = async (account_id: number) => {
    const notifications = await Notification.find({ accountId: account_id });
    return notifications;
};

export const getOneUserNotification = async (
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

export const getDeleteUserNotification = async (
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
