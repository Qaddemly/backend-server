import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../Business/Business';
import { Account } from '../Account/Account';

@Entity()
export class FollowBusiness {
    /**
     *
     * Index is created on (account_id, business_id)
     * It's effective when querying account_id only or both together
     * It's not effective if querying business_id only
     * So We need to create another idx on business_id
     * */
    @PrimaryColumn({ name: 'account_id' })
    account_id: number;

    @PrimaryColumn({ name: 'business_id' })
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
