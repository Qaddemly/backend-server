import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { Account } from '../../Account/Account';
import { CustomJobApplicationSubmit } from './CustomJobApplicationSubmit';

@Entity()
export class AccountArchivedCustomJobApplications {
    @PrimaryColumn()
    custom_job_application_submit_id: number; // Single column as both Primary & Foreign Key

    @OneToOne(
        () => CustomJobApplicationSubmit,
        (custom_job_application_submit) =>
            custom_job_application_submit.account_archived_custom_job_application,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'custom_job_application_submit_id' }) // Links to CustomJobApplicationSubmit
    custom_job_application_submit: CustomJobApplicationSubmit;

    // To Get ALl Archived Job Applications of an Account quickly
    @Index('archived_custom_job_applications_idx_on_account_id')
    @ManyToOne(
        () => Account,
        (account) => account.archived_custom_job_applications,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @Column('boolean')
    is_archived: boolean;
}
