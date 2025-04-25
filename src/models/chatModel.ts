// import * as mongoose from 'mongoose';
// import { messageDoc, messageSchema } from './messageModel';

// interface chatDoc extends mongoose.Document {
//     userId: number;
//     businessId: number;
//     messages: messageDoc[];
// }

// export const chatSchema = new mongoose.Schema<chatDoc>(
//     {
//         userId: { type: Number, required: true },
//         businessId: { type: Number, required: true },
//         messages: [messageSchema],
//     },
//     {
//         timestamps: true,
//     },
// );

// export const ChatModel = mongoose.model<chatDoc>('Chat', chatSchema, 'chats');
