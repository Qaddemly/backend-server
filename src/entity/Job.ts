import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { LocationType } from '../enums/locationType';
import { EmploymentType } from '../enums/employmentType';
import { Business } from './Business';
import { JobApplication } from './JobApplication';

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    title: string;

    @Column('text')
    description: string;

    @Column('text')
    location: string;

    @Column({
        type: 'enum',
        enum: LocationType,
        default: LocationType.Onsite,
    })
    location_type: LocationType;

    // Will be added Later
    // Not sure if this is the right way
    @Column('text', { array: true })
    skills: string;

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
}
