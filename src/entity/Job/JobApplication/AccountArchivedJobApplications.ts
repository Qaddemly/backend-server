import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { Account } from '../../Account/Account';
import { JobApplication } from './JobApplication';

@Entity()
export class AccountArchivedJobApplications {
    @PrimaryColumn()
    job_application_id: number; // Single column as both Primary & Foreign Key

    @OneToOne(
        () => JobApplication,
        (job_application) => job_application.account_archived_job_application,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'job_application_id' }) // Links to JobApplication
    job_application: JobApplication;

    // To Get ALl Archived Job Applications of an Account quickly
    @Index('archived_job_applications_idx_on_account_id')
    @ManyToOne(() => Account, (account) => account.archived_job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column('boolean')
    is_archived: boolean;
    @CreateDateColumn()
    created_at: Date;
}
