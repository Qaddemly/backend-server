import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Account } from '../Account/Account';
import { Business } from '../Business/Business';
import { JobApplicationState } from '../Job/JobApplicationStates';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    message: string;
    @Column({ default: false })
    isSeen: boolean;
    @Column({ default: false })
    isRead: boolean;
    @Column({ default: false })
    isSent: boolean;
    @ManyToOne(() => Account, (account) => account.notifications, {
        cascade: true,
    })
    @JoinColumn({ name: 'account_id' }) // Links to Account
    account: Account;
    @ManyToOne(() => Business, (business) => business.notifications, {
        cascade: true,
    })
    @JoinColumn({ name: 'business_id' }) // Links to Business
    business: Business;
    @ManyToOne(
        () => JobApplicationState,
        (job_application_state) => job_application_state.notifications,
        {
            cascade: true,
        },
    )
    @JoinColumn({ name: 'job_application_state_id' }) // Links to JobApplicationState
    job_application_state: JobApplicationState;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
