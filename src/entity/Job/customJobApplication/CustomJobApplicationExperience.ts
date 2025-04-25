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
import { CustomJobApplicationSubmit } from './CustomJobApplicationSubmit';
@Entity()
export class CustomJobApplicationExperience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    job_title: string;

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
        () => CustomJobApplicationSubmit,
        (customJobApplicationSubmit) =>
            customJobApplicationSubmit.custom_job_application_experience,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'custom_job_application_submit_id' }) // Links to CustomJobApplicationSubmit
    custom_job_application_submit: CustomJobApplicationSubmit; // Foreign key to CustomJobApplicationSubmit
}
