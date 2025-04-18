import { Repository } from 'typeorm';
import { Notification } from '../../entity/Notification/Notification';
import { AppDataSource } from '../../data-source';

class NotificationRepositoryClass extends Repository<Notification> {}

export const NotificationRepository = AppDataSource.getRepository(
    Notification,
).extend(NotificationRepositoryClass.prototype);
