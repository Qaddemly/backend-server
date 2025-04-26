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
import { CustomJobApplicationSubmit } from './CustomJobApplicationSubmit';

@Entity()
export class CustomJobApplication {
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
    @OneToOne(() => Job, (job) => job.custom_job_application, { cascade: true })
    @JoinColumn({ name: 'job_id' }) // Links to Job
    job: Job; // One-to-One relationship with Job entity
    @OneToMany(
        () => CustomJobApplicationSubmit,
        (customJobApplicationSubmit) =>
            customJobApplicationSubmit.custom_job_application,
    )
    custom_job_application_submits: CustomJobApplicationSubmit[];
}
