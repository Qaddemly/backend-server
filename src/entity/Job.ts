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

@Entity()
export class Job {
    @Index('job_idx_on_id', { unique: true })
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

    @ManyToMany(() => Account, (account) => account.saved_jobs, {
        cascade: true,
    })
    saved_by_accounts: Account[];
    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
