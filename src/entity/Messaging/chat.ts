import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../Business/Business';
import { Account } from '../Account/Account';
import { Message } from './Message';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'business_id' })
    business_id: number;

    @JoinColumn({
        name: 'business_id',
        foreignKeyConstraintName: 'FK_CHAT_BUSINESS',
    })
    @ManyToOne(() => Business, (business) => business.chats, {
        onDelete: 'CASCADE',
    })
    business: Business;

    @Column({ name: 'account_id' })
    account_id: number;

    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_CHAT_ACCOUNT',
    })
    @ManyToOne(() => Account, (account) => account.chats, {
        onDelete: 'CASCADE',
    })
    account: Account;

    @OneToMany(() => Message, (message) => message.chat, { cascade: true })
    messages: Message[];

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    // TODO: Add last send message and last seen message
}
