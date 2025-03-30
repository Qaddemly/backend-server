export interface messageDTO {
    chatId: number;
    senderId: number;
    receiverId: number;
    content: string;
    isSeen: boolean;
    isDelivered: boolean;
}
