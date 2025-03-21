import { eventEmitter } from './eventEmitter';
import { sendJobNotification } from '../services/notificationServices';
import { Job } from '../entity/Job/Job';

eventEmitter.on('sendNotification', async (job: Job) => {
    try {
        console.log(`Processing notification for job:`, job);

        await sendJobNotification(job);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
});
