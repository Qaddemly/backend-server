import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Job } from './Job';
import { Resume } from './Resume';
import { Account } from './Account';
import { JobApplicationStateEnum } from '../enums/jobApplicationStateEnum';
import { JobApplicationState } from './JobApplicationStates';

@Entity()
export class JobApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'job_id' })
    job_id: number;

    @ManyToOne(() => Job, (job) => job.job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'job_id',
        foreignKeyConstraintName: 'FK_JOB_APPLICATION_JOB',
    })
    job: Job;

    @Column({ name: 'account_id' })
    account_id: number;

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

    @ManyToOne(() => Resume, (resume) => resume.job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'resume_id',
        foreignKeyConstraintName: 'FK_JOB_APPLICATION_RESUME',
    })
    resume: Resume;
    @OneToOne(() => JobApplicationState, (jas) => jas.job_application)
    job_application_state: JobApplicationState;

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
