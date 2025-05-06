import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Job } from '../Job';
import { join } from 'path';
import { Business } from '../../Business/Business';
import { JobApplication } from './JobApplication';
import { AccountArchivedJobApplications } from './AccountArchivedJobApplications';

@Entity()
export class JobApplicationForm {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    job_id: number; // Foreign Key to Job table

    // @Column({ default: true })
    // is_education_required: boolean; // Indicates if education is required for the job
    // @Column({ default: true })
    // is_experience_required: boolean; // Indicates if experience is required for the job
    // @Column({ default: true })
    // is_skills_required: boolean; // Indicates if skills are required for the job
    // @Column({ default: true })
    // is_languages_required: boolean; // Indicates if language is required for the job
    @OneToOne(() => Job, (job) => job.job_application_form, { cascade: true })
    @JoinColumn({ name: 'job_id' }) // Links to Job
    job: Job; // One-to-One relationship with Job entity
    @OneToMany(
        () => JobApplication,
        (JobApplication) => JobApplication.job_application_form,
    )
    job_applications: JobApplication[];

    @OneToMany(
        () => AccountArchivedJobApplications,
        (archived_job_applications) =>
            archived_job_applications.job_application_form,
        { onDelete: 'CASCADE' },
    )
    archived_job_applications: AccountArchivedJobApplications[];
}
