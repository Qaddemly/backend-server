import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
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

    @Column({ name: 'business_id' })
    business_id: number;

    @Index('review_idx_on_business_id')
    @ManyToOne(() => Business, (business) => business.reviews, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'business_id',
        foreignKeyConstraintName: 'FK_REVIEW_BUSINESS',
    })
    business: Business;

    @Column({ name: 'account_id' })
    account_id: number;

    @Index('review_idx_on_account_id')
    @ManyToOne(() => Account, (account) => account.reviews, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_REVIEW_ACCOUNT',
    })
    account: Account;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
