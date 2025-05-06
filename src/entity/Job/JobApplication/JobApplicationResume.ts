import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { JobApplication } from './JobApplication';
@Entity()
export class JobApplicationResume {
    @PrimaryGeneratedColumn()
    id: number;
    @Column('text')
    url: string;
    @Column('text', { default: null })
    name: string;
    @Column({ default: null })
    size: number;
    @ManyToOne(
        () => JobApplication,
        (customJobApplicationSubmit) =>
            customJobApplicationSubmit.job_application_resume,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'custom_job_application_id' }) // Links to JobApplication
    job_application: JobApplication; // Foreign key to JobApplication
}
