import { eventEmitter } from './eventEmitter';
import {
    recommendJobToUsers,
    sendJobApplicationUpdateNotification,
    sendJobNotification,
    sendMessageFromBusiness,
    sendMessageToBusiness,
} from '../services/notificationServices';
import { Job } from '../entity/Job/Job';

eventEmitter.on('sendJobPostedNotification', async (job: Job) => {
    try {
        console.log(`Processing notification for job:`, job);

        await sendJobNotification(job);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
});

eventEmitter.on(
    'sendUpdateJobApplicationStatusNotification',
    async (customJobApplication: any) => {
        try {
            await sendJobApplicationUpdateNotification(customJobApplication);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    },
);

eventEmitter.on('userSentMessageToBusiness', async (messageData: any) => {
    try {
        await sendMessageToBusiness(messageData);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
});

eventEmitter.on('businessSentMessageToUser', async (messageData: any) => {
    try {
        await sendMessageFromBusiness(messageData);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
});

eventEmitter.on('sendRecommendationJobToUsers', async ({ data, job }) => {
    try {
        console.log(`Processing recommendation for job:`, job);
        await recommendJobToUsers(job, data);
    } catch (error) {
        console.error('Error sending recommendation:', error);
    }
});
