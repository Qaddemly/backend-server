import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EmploymentType } from '../../../enums/employmentType';
import { LocationType } from '../../../enums/locationType';
import { JobApplication } from './JobApplication';
@Entity()
export class JobApplicationExperience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    job_title: string;
    @Column('text', { default: null })
    description: string;
    @Column({ type: 'enum', enum: EmploymentType })
    employment_type: EmploymentType;

    @Column('text')
    company_name: string;

    @Column('text')
    location: string;

    @Column({ type: 'enum', enum: LocationType })
    location_type: LocationType;

    @Column('bool')
    still_working: boolean;

    @Column('date')
    start_date: Date;

    @Column('date', { nullable: true })
    end_date: Date;

    @ManyToOne(
        () => JobApplication,
        (JobApplication) => JobApplication.job_application_experience,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'job_application_id' }) // Links to CustomJobApplicationSubmit
    job_application: JobApplication; // Foreign key to CustomJobApplicationSubmit
}
