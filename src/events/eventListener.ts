import { eventEmitter } from './eventEmitter';
import {
    sendJobApplicationUpdateNotification,
    sendJobNotification,
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
