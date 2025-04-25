import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CustomJobApplicationEducation } from './CustomJobApplicationEducation';
import { CustomJobApplicationExperience } from './CustomJobApplicationExperience';
import { CustomJobApplicationResume } from './CustomJobApplicationResume';
import { CustomJobApplication } from './CustomJobApplication';
import { Account } from '../../Account/Account';
import { CustomJobApplicationState } from './CustomJobApplicationStates';
import { AccountArchivedCustomJobApplications } from './AccountArchivedCustomJobApplications';

@Entity()
export class CustomJobApplicationSubmit {
    @PrimaryGeneratedColumn()
    id: number; // Unique identifier for the custom job application
    @Column()
    first_name: string; // First name of the applicant
    @Column()
    last_name: string; // Last name of the applicant
    @Column()
    email: string; // Email address of the applicant
    @Column()
    phone: string; // Phone number of the applicant
    @Column({ type: 'date' })
    birth_date: Date; // Birth date of the applicant
    @Column({ type: 'simple-array' })
    skills: string[]; // List of skills of the applicant
    @Column({ type: 'simple-array' })
    languages: string[]; // List of languages spoken by the applicant

    @ManyToOne(
        () => CustomJobApplication,
        (CustomJobApplication) =>
            CustomJobApplication.custom_job_application_submits,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'custom_job_application_id' })
    custom_job_application: CustomJobApplication;

    @OneToOne(
        () => CustomJobApplicationState,
        (cjas) => cjas.custom_job_application_submit,
        {
            onDelete: 'CASCADE',
        },
    )
    custom_job_application_state: CustomJobApplicationState;
    @OneToOne(
        () => AccountArchivedCustomJobApplications,
        (accountACJA) => accountACJA.custom_job_application_submit,
        {
            onDelete: 'CASCADE',
        },
    )
    account_archived_custom_job_application: AccountArchivedCustomJobApplications;
    @ManyToOne(
        () => Account,
        (account) => account.custom_job_application_submits,
    )
    @JoinColumn({ name: 'account_id' })
    account: Account;
    @OneToMany(
        () => CustomJobApplicationEducation,
        (custom_job_application_education) =>
            custom_job_application_education.custom_job_application_submit,
        { onDelete: 'CASCADE' },
    )
    custom_job_application_education: CustomJobApplicationEducation[]; // List of education details of the applicant
    @OneToMany(
        () => CustomJobApplicationExperience,
        (custom_job_application_experience) =>
            custom_job_application_experience.custom_job_application_submit,
        { onDelete: 'CASCADE' },
    )
    custom_job_application_experience: CustomJobApplicationExperience[]; // List of experience details of the applicant
    @OneToMany(
        () => CustomJobApplicationResume,
        (custom_job_application_resume) =>
            custom_job_application_resume.custom_job_application_submit,
        { onDelete: 'CASCADE' },
    )
    custom_job_application_resume: CustomJobApplicationResume[]; // List of resume details of the applicant
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
