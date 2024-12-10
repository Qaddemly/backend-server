import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from './Business';
import { Account } from './Account';

@Entity()
export class FollowBusiness {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Business)
    @JoinColumn({
        name: 'business_id',
        foreignKeyConstraintName: 'FK_FOLLOW_BUSINESS_BUSINESS',
    })
    business: Business;

    @ManyToOne(() => Account)
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_FOLLOW_BUSINESS_ACCOUNT',
    })
    account: Account;
}
