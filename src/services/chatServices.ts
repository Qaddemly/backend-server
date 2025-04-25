import { ChatRepository } from '../Repository/Messaging/chatRepository';
import { MessageRepository } from '../Repository/Messaging/messageRepository';
import AppError from '../utils/appError';

export const getAllChatsOfUser = async (userId: number) => {
    const chats = await ChatRepository.createQueryBuilder('chat')
        .leftJoinAndSelect('chat.business', 'business')
        .leftJoin('chat.account', 'account')
        .addSelect([
            'account.id',
            'account.first_name',
            'account.last_name',
            'account.email',
            'account.profile_picture',
            'account.about_me',
            'account.subtitle',
            'account.address.country',
            'account.address.city',
            'account.phone.country_code',
            'account.phone.number',
            'account.links.linkedin',
            'account.links.github',
            'account.links.portfolio',
            'account.links.twitter',
            'account.links.facebook',
            'account.links.instagram',
            'account.links.youtube',
            'account.links.website',
        ])
        .where('account.id = :userId', { userId })
        .getMany();

    return chats;
};

export const getMessagesOfChatOfUser = async (
    userId: number,
    chatId: number,
    page: number,
) => {
    // We need to check if the chatId is valid and belongs to the user
    const chat = await ChatRepository.findOneBy({
        id: chatId,
        account_id: userId,
    });
    if (!chat) {
        throw new AppError(
            'Chat not found or does not belong to the user',
            403,
        );
    }

    const messages = await MessageRepository.createQueryBuilder('message')
        .where('message.chat_id = :chatId', { chatId })
        .orderBy('message.created_at', 'DESC')
        .skip((page - 1) * 100) // Assuming 10 messages per page
        .take(100)
        .getMany();
    return messages.reverse();
};

export const createChat = async (businessId: number, accountId: number) => {
    const existingChat = await ChatRepository.findOne({
        where: {
            business_id: businessId,
            account_id: accountId,
        },
    });
    console.log(existingChat);
    if (existingChat) {
        return existingChat;
    }
    // Create a new chat if it doesn't exist
    const chat = ChatRepository.create({
        business_id: businessId,
        account_id: accountId,
    });
    await ChatRepository.save(chat);
    return chat;
};
export const getAllChatsOfBusiness = async (businessId: number) => {
    const chats = await ChatRepository.createQueryBuilder('chat')
        .leftJoinAndSelect('chat.business', 'business')
        .leftJoin('chat.account', 'account')
        .addSelect([
            'account.id',
            'account.first_name',
            'account.last_name',
            'account.email',
            'account.profile_picture',
            'account.about_me',
            'account.subtitle',
            'account.address.country',
            'account.address.city',
            'account.phone.country_code',
            'account.phone.number',
            'account.links.linkedin',
            'account.links.github',
            'account.links.portfolio',
            'account.links.twitter',
            'account.links.facebook',
            'account.links.instagram',
            'account.links.youtube',
            'account.links.website',
        ])
        .where('business.id = :businessId', { businessId })
        .getMany();
    return chats;
};

export const getAllMessagesOfBusinessChat = async (
    businessId: number,
    chatId: number,
    page: number,
) => {
    // We need to check if the chatId is valid and belongs to the business
    const chat = await ChatRepository.findOneBy({
        id: chatId,
        business_id: businessId,
    });
    if (!chat) {
        throw new AppError(
            'Chat not found or does not belong to the business',
            403,
        );
    }

    const messages = await MessageRepository.createQueryBuilder('message')
        .where('message.chat_id = :chatId', { chatId })
        .orderBy('message.created_at', 'DESC')
        .skip((page - 1) * 100) // Assuming 10 messages per page
        .take(100)
        .getMany();
    return messages.reverse();
};
