import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';
import { JobApplication } from '../Job/JobApplication';
import { CustomJobApplicationSubmit } from '../Job/customJobApplicatoinsSubmit';
@Entity({ name: 'account_resume_file' })
export class AccountResume {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, (account) => account.resumes, {
        onDelete: 'CASCADE',
    })
    account: Account;
    @OneToMany(
        () => JobApplication,
        (job_application) => job_application.resume,
        {
            onDelete: 'CASCADE',
        },
    )
    job_applications: JobApplication[];
    @Column('text')
    url: string;
    @Column('text', { default: null })
    name: string;
    @Column({ default: null })
    size: number;
    @ManyToOne(
        () => CustomJobApplicationSubmit,
        (customJobApplicationSubmit) =>
            customJobApplicationSubmit.accountEducation,
    )
    @JoinColumn({ name: 'custom_job_application_submit_id' }) // Links to CustomJobApplicationSubmit
    custom_job_application_submit: CustomJobApplicationSubmit; // Foreign key to CustomJobApplicationSubmit
}
