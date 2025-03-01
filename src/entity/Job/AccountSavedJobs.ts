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
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { Account } from '../Account/Account';
import { Job } from './Job';

@Entity({ name: 'account_saved_jobs' })
export class AccountSavedJobs {
    /**
     * Composite index is created on (account_id, job_id)
     * It's effective when querying account_id only or both together
     * It's not effective if querying job_id only
     * */
    @PrimaryColumn({ name: 'account_id' })
    account_id: number;

    @PrimaryColumn({ name: 'job_id' })
    job_id: number;

    @ManyToOne(() => Account, (account) => account.saved_jobs, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(() => Job, (job) => job.savedByAccounts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_id' })
    job: Job;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
