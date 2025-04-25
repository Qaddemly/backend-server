import { Repository } from 'typeorm';
import { Message } from '../../entity/Messaging/Message';
import { AppDataSource } from '../../data-source';

class MessageRepositoryClass extends Repository<Message> {}

export const MessageRepository = AppDataSource.getRepository(Message).extend(
    MessageRepositoryClass.prototype,
);
