import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Job } from './Job';
import { AccountResume } from '../Account/AccountResume';
import { Account } from '../Account/Account';
import { JobApplicationStateEnum } from '../../enums/jobApplicationStateEnum';
import { JobApplicationState } from './JobApplicationStates';
import { AccountArchivedJobApplications } from './AccountArchivedJobApplications';

@Entity()
export class JobApplication {
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Composite primary key (account_id, job_id)
     * It's effective when querying account_id only or both together
     * It's not effective if querying job_id only
     * So We need to create another idx on job_id
     * */
    @Column({ name: 'account_id' })
    account_id: number;

    @Column({ name: 'job_id' })
    job_id: number;

    @Index('job_application_idx_on_job_id')
    @ManyToOne(() => Job, (job) => job.job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'job_id',
        foreignKeyConstraintName: 'FK_JOB_APPLICATION_JOB',
    })
    job: Job;

    @Index('job_application_idx_on_account_id')
    @ManyToOne(() => Account, (account) => account.job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_JOB_APPLICATION_ACCOUNT',
    })
    account: Account;

    @Column({ name: 'resume_id', nullable: true })
    resume_id: number;

    @ManyToOne(() => AccountResume, (resume) => resume.job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'resume_id',
        foreignKeyConstraintName: 'FK_JOB_APPLICATION_RESUME',
    })
    resume: AccountResume;

    @OneToOne(() => JobApplicationState, (jas) => jas.job_application)
    job_application_state: JobApplicationState;
    //make relation
    @OneToOne(
        () => AccountArchivedJobApplications,
        (archived) => archived.job_application,
        {
            cascade: true,
        },
    )
    archived_job_application: AccountArchivedJobApplications;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}

/**
 * Get all job application of user
 * Get all job application of certain state (PENDING - ACCEPTED - REJECTED - UNDER_REVIEW - UNDER_CONSIDERATION)
 *
 * Move job application to & from archive
 * Update status of job application from business side
 *
 * */
