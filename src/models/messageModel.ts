// import * as mongoose from 'mongoose';

// export interface messageDoc extends mongoose.Document {
//     chatId: number;
//     senderId: number;
//     receiverId: number;
//     isSeen: boolean;
//     isDelivered: boolean;
//     content: string;
//     createdAt: Date;
// }

// export const messageSchema = new mongoose.Schema<messageDoc>(
//     {
//         chatId: { type: Number, required: true },
//         senderId: { type: Number, required: true },
//         receiverId: { type: Number, required: true },
//         isSeen: { type: Boolean, default: false },
//         isDelivered: { type: Boolean, default: false },
//         content: { type: String, required: true },
//         createdAt: { type: Date, default: Date.now },
//     },
//     {
//         timestamps: true,
//     },
// );
