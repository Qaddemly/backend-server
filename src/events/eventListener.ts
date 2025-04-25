import { eventEmitter } from './eventEmitter';
import {
    sendCustomJobApplicationUpdateNotification,
    sendJobApplicationUpdateNotification,
    sendJobNotification,
} from '../services/notificationServices';
import { Job } from '../entity/Job/Job';
import { JobApplication } from '../entity/Job/JobApplication';

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
    async (jobApplication: JobApplication) => {
        try {
            console.log(
                `Processing notification for jobApplication:`,
                jobApplication,
            );

            await sendJobApplicationUpdateNotification(jobApplication);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    },
);

eventEmitter.on(
    'sendUpdateCustomJobApplicationStatusNotification',
    async (customJobApplication: JobApplication) => {
        try {
            console.log(
                `Processing notification for customJobApplication:`,
                customJobApplication,
            );

            await sendCustomJobApplicationUpdateNotification(
                customJobApplication,
            );
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    },
);
