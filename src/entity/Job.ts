import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { LocationType } from '../enums/locationType';
import { EmploymentType } from '../enums/employmentType';
import { Business } from './Business';
import { JobApplication } from './JobApplication';
import { Account } from './Account';
import { JobStatus } from '../enums/jobStatus';
import { Address } from './Address';
import { Country } from '../enums/country';
import { JobApplicationState } from './JobApplicationStates';
import { AccountSavedJobs } from './AccountSavedJobs';

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    title: string;

    @Column('text')
    description: string;

    @Column({
        type: 'enum',
        enum: Country,
    })
    country: Country;

    @Column('text')
    city: string;

    @Column({
        type: 'enum',
        enum: LocationType,
        default: LocationType.Onsite,
    })
    location_type: LocationType;

    @Column({ default: JobStatus.OPENED })
    status: JobStatus;

    @Column('text', { array: true })
    skills: string[];

    @Column('float')
    salary: number;

    @Column({
        type: 'enum',
        enum: EmploymentType,
        default: EmploymentType.FullTime,
    })
    employee_type: EmploymentType;

    @Column('text', { array: true })
    keywords: string[];

    @Column('int')
    experience: number;

    @Column({ name: 'business_id' })
    business_id: number;

    @Index('job_index_on_business_id')
    @ManyToOne(() => Business, (business) => business.jobs, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'business_id',
        foreignKeyConstraintName: 'FK_JOB_BUSINESS',
    })
    business: Business;

    @OneToMany(() => JobApplication, (job_application) => job_application.job, {
        cascade: true,
    })
    job_applications: JobApplication[];

    @OneToMany(
        () => JobApplicationState,
        (business_job_application_state) => business_job_application_state.job,
        { cascade: true },
    )
    job_application_states: JobApplicationState[];
    @OneToMany(
        () => AccountSavedJobs,
        (account_saved_jobs) => account_saved_jobs.job,
        { cascade: true },
    )
    saved_jobs: AccountSavedJobs[];

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
