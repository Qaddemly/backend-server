import express from 'express';
import {
    getNumberOfActiveJobs,
    getNumberOfNewlyPostedJobs,
} from '../controllers/jobController';
import { getNumberOfUsers } from '../controllers/accountController';
import { getNumberOfBusinesses } from '../controllers/businessController';
import { protect } from '../services/authServices';
import {
    deleteUserNotification,
    getAllUserNotifications,
    makeAllNotificationsRead,
    makeAllNotificationsSeen,
    readNotification,
} from '../controllers/notificationController';

export const notificationRouter = express.Router();
notificationRouter.get(
    '/getAllUserNotifications',
    protect,
    getAllUserNotifications,
);
notificationRouter.put('/read/:id', protect, readNotification);
notificationRouter.get('/seenNotifications', protect, makeAllNotificationsSeen);
notificationRouter.post(
    '/readNotifications',
    protect,
    makeAllNotificationsRead,
);
notificationRouter.delete('/:id', protect, deleteUserNotification);
export default notificationRouter;
