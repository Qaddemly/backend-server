import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from './Business';
import { Account } from './Account';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    description: string;

    @Column('integer')
    rating: number;

    @ManyToOne(() => Business, (business) => business.reviews, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'business_id',
        foreignKeyConstraintName: 'FK_REVIEW_BUSINESS',
    })
    business: Business;

    @ManyToOne(() => Account, (account) => account.reviews, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_REVIEW_ACCOUNT',
    })
    account: Account;
}
