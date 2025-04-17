import { Repository } from 'typeorm';
import { Chat } from '../../entity/Messaging/chat';
import { AppDataSource } from '../../data-source';

class ChatRepositoryClass extends Repository<Chat> {}

export const ChatRepository = AppDataSource.getRepository(Chat).extend(
    ChatRepositoryClass.prototype,
);
