import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from './Business';
import { Account } from './Account';

@Entity()
export class FollowBusiness {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'business_id' })
    business_id: number;

    @Index('follow_business_idx_on_business_id')
    @ManyToOne(() => Business, (business) => business.followers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({
        name: 'business_id',
        foreignKeyConstraintName: 'FK_FOLLOW_BUSINESS_BUSINESS',
    })
    business: Business;

    @Column({ name: 'account_id' })
    account_id: number;

    @Index('follow_business_idx_on_account_id')
    @ManyToOne(() => Account, (account) => account.follow_businesses, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_FOLLOW_BUSINESS_ACCOUNT',
    })
    account: Account;
}
