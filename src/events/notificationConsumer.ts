import amqp from 'amqplib';
import { sendJobNotification } from '../services/notificationServices';
import { JobRepository } from '../Repository/Job/jobRepository';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

const consumeNotifications = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue('send_notification', { durable: true });

        channel.consume(
            'send_notification',
            async (message) => {
                if (message) {
                    const { jobId } = JSON.parse(message.content.toString());
                    console.log(
                        `Processing job notification for job ID: ${jobId}`,
                    );

                    // Fetch job details
                    const job = await JobRepository.findOne({
                        where: { id: jobId },
                        relations: ['business'],
                    });
                    if (job) {
                        await sendJobNotification(job);
                    }

                    channel.ack(message);
                }
            },
            { noAck: false },
        );
    } catch (error) {
        console.error('Error consuming notifications:', error);
    }
};

export default consumeNotifications;
