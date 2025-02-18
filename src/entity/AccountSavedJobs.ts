import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Account } from './Account';
import { Job } from './Job';

@Entity()
export class AccountSavedJobs {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Job, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_id' }) // Links to Job
    job: Job[];

    @ManyToOne(() => Account, (account) => account.saved_jobs, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'account_id' }) // Links to Account
    account: Account;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
