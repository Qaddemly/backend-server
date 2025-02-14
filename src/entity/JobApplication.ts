import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Job } from './Job';
import { Resume } from './Resume';
import { Account } from './Account';
import { JobApplicationState } from '../enums/jobApplicationState';

@Entity()
export class JobApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Job, (job) => job.job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'job_id',
        foreignKeyConstraintName: 'FK_JOB_APPLICATION_JOB',
    })
    job: Job;

    @ManyToOne(() => Account, (account) => account.job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_JOB_APPLICATION_ACCOUNT',
    })
    account: Account;

    @ManyToOne(() => Resume, (resume) => resume.job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'resume_id',
        foreignKeyConstraintName: 'FK_JOB_APPLICATION_RESUME',
    })
    resume: Resume;

    @Column({
        type: 'enum',
        enum: JobApplicationState,
        default: JobApplicationState.PENDING,
    })
    jop_application_state: JobApplicationState;

    @Column({ type: 'boolean', default: false })
    is_archived: boolean;

    @Column()
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
