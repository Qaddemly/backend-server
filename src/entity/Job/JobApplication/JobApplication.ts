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

import { Account } from '../../Account/Account';
import { JobApplicationState } from './JobApplicationStates';
import { JobApplicationEducation } from './JobApplicationEducation';
import { JobApplicationResume } from './JobApplicationResume';
import { JobApplicationExperience } from './JobApplicationExperience';
import { AccountArchivedJobApplications } from './AccountArchivedJobApplications';
import { Job } from '../Job';
import { Phone } from '../../General/Phone';

@Entity()
export class JobApplication {
    @PrimaryGeneratedColumn()
    id: number; // Unique identifier for the custom job application
    @Column()
    first_name: string; // First name of the applicant
    @Column()
    last_name: string; // Last name of the applicant
    @Column()
    email: string; // Email address of the applicant
    @Column(() => Phone, { prefix: false })
    phone: Phone;
    @Column({ type: 'date' })
    birth_date: Date; // Birth date of the applicant
    @Column({ type: 'simple-array' })
    skills: string[]; // List of skills of the applicant
    @Column({ type: 'simple-array' })
    languages: string[]; // List of languages spoken by the applicant

    @OneToOne(() => JobApplicationState, (cjas) => cjas.job_application, {
        onDelete: 'CASCADE',
    })
    job_application_state: JobApplicationState;
    @OneToOne(
        () => AccountArchivedJobApplications,
        (accountACJA) => accountACJA.job_application,
        {
            onDelete: 'CASCADE',
        },
    )
    account_archived_job_application: AccountArchivedJobApplications;
    @ManyToOne(() => Account, (account) => account.job_applications)
    @JoinColumn({ name: 'account_id' })
    account: Account;

    @ManyToOne(() => Job, (job) => job.job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'job_id' })
    job: Job;
    @OneToMany(
        () => JobApplicationEducation,
        (job_application_education) =>
            job_application_education.job_application,
        { onDelete: 'CASCADE' },
    )
    job_application_education: JobApplicationEducation[]; // List of education details of the applicant
    @OneToMany(
        () => JobApplicationExperience,
        (job_application_experience) =>
            job_application_experience.job_application,
        { onDelete: 'CASCADE' },
    )
    job_application_experience: JobApplicationExperience[]; // List of experience details of the applicant
    @OneToMany(
        () => JobApplicationResume,
        (job_application_resume) => job_application_resume.job_application,
        { onDelete: 'CASCADE' },
    )
    job_application_resume: JobApplicationResume[]; // List of resume details of the applicant
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
