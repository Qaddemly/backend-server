import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { JobApplication } from './JobApplication';

@Entity()
export class JobApplicationEducation {
    @PrimaryGeneratedColumn()
    id: number;
    @Column('text')
    university: string;

    @Column('text')
    field_of_study: string;

    @Column('float')
    gpa: number;

    @Column('date')
    start_date: Date;

    @Column('date')
    end_date: Date;

    @ManyToOne(
        () => JobApplication,
        (JobApplication) => JobApplication.job_application_education,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'job_application_id' }) // Links to JobApplication
    job_application: JobApplication; // Foreign key to JobApplication
}
