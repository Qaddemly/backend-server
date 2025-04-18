import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Job } from './Job';
import { join } from 'path';
import { Business } from '../Business/Business';

@Entity()
export class CustomJobApplication {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    job_id: number; // Foreign Key to Job table
    @Column()
    business_id: number; // Foreign Key to Business table
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
    @ManyToMany(
        () => Business,
        (business) => business.custom_job_applications,
        { cascade: true },
    )
    @JoinColumn({ name: 'business_id' }) // Links to Business
    business: Business; // Many-to-Many relationship with Business entity
}
