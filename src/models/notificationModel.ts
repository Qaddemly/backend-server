import mongoose from 'mongoose';
import { NotificationType } from '../enums/notification';
export interface NotificationDoc extends mongoose.Document {
    accountId: number;
    message: string;
    type: string;
    isRead: boolean;
    isSent: boolean;
    isSeen: boolean;
    jobId?: number;
    businessId?: number;
    jobApplicationId?: number;
    customJobApplicationSubmitId?: number;
}
const notificationSchema = new mongoose.Schema<NotificationDoc>(
    {
        accountId: {
            type: Number,
            required: true,
        },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: NotificationType,
            required: true,
        },
        isRead: { type: Boolean, default: false },
        isSeen: { type: Boolean, default: false },
        jobId: Number,
        businessId: Number,
        jobApplicationId: Number,
        customJobApplicationSubmitId: Number,
        isSent: { type: Boolean, default: false },
    },
    { timestamps: true },
);
export const Notification = mongoose.model<NotificationDoc>(
    'Notification',
    notificationSchema,
);
