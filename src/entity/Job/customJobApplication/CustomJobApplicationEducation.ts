import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomJobApplicationSubmit } from './CustomJobApplicationSubmit';

@Entity()
export class CustomJobApplicationEducation {
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
        () => CustomJobApplicationSubmit,
        (customJobApplicationSubmit) =>
            customJobApplicationSubmit.custom_job_application_education,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'custom_job_application_submit_id' }) // Links to CustomJobApplicationSubmit
    custom_job_application_submit: CustomJobApplicationSubmit; // Foreign key to CustomJobApplicationSubmit
}
