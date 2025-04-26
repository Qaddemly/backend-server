import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomJobApplicationSubmit } from '../customJobApplication/CustomJobApplicationSubmit';
@Entity()
export class CustomJobApplicationResume {
    @PrimaryGeneratedColumn()
    id: number;
    @Column('text')
    url: string;
    @Column('text', { default: null })
    name: string;
    @Column({ default: null })
    size: number;
    @ManyToOne(
        () => CustomJobApplicationSubmit,
        (customJobApplicationSubmit) =>
            customJobApplicationSubmit.custom_job_application_resume,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'custom_job_application_submit_id' }) // Links to CustomJobApplicationSubmit
    custom_job_application_submit: CustomJobApplicationSubmit; // Foreign key to CustomJobApplicationSubmit
}
