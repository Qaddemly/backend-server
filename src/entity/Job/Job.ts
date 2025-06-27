import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { LocationType } from '../../enums/locationType';
import { EmploymentType } from '../../enums/employmentType';
import { Business } from '../Business/Business';
import { Account } from '../Account/Account';
import { JobStatus } from '../../enums/jobStatus';
import { Address } from '../General/Address';
import { Country } from '../../enums/country';
import { AccountSavedJobs } from './AccountSavedJobs';
import { JobApplication } from './JobApplication/JobApplication';

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
        nullable: true,
    })
    country: Country;

    @Column('text', { nullable: true })
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
    @Column({ default: 'EGP' })
    currency: string;
    @Column({
        type: 'boolean',
        default: false,
    })
    has_extra_link_application: boolean;

    @Column({
        type: 'text',
        nullable: true,
    })
    extra_application_link: string;

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

    @OneToMany(
        () => AccountSavedJobs,
        (accountSavedJobs) => accountSavedJobs.job,
    )
    savedByAccounts: AccountSavedJobs[];

    @OneToMany(() => JobApplication, (JobApplication) => JobApplication.job)
    job_applications: JobApplication[];
    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
