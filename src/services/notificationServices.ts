import { Response } from 'express';
import { redisClient } from '../config/redis';
import { Job } from '../entity/Job/Job';
import { NotificationType } from '../enums/notification';
import { Notification } from '../models/notificationModel';
import { FollowBusinessRepository } from '../Repository/General/followBusinessRepository';
import { clients } from '../controllers/notificationController';
async function getClientsList() {
    const clientStrings = await redisClient.lRange('clients', 0, -1); // Get all items
    return clientStrings.map((client) => JSON.parse(client)); // Convert JSON to object
}
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
