import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'account_id' })
    account_id: number;

    @Column({ name: 'business_id' })
    business_id: number;

    @Column({ name: 'chat_id' })
    chat_id: number;

    @Column('text')
    content: string;

    @Column({
        type: 'boolean',
        default: false,
    })
    is_delivered: boolean;

    @Column({
        type: 'boolean',
        default: false,
    })
    is_seen: boolean;

    @ManyToOne(() => Chat, (chat) => chat.messages, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'chat_id',
        foreignKeyConstraintName: 'FK_MESSAGE_CHAT',
    })
    chat: Chat; // Assuming you have a Chat entity defined

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;
}
