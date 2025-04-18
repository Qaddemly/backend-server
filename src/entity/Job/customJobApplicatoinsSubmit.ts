import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AccountEducation } from '../Account/AccountEducation';
import { AccountExperience } from '../Account/AccountExperience';
import { AccountResume } from '../Account/AccountResume';

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
    @OneToMany(
        () => AccountEducation,
        (accountEducation) => accountEducation.custom_job_application_submit,
        { cascade: true },
    )
    accountEducation: AccountEducation[]; // List of education details of the applicant
    @OneToMany(
        () => AccountExperience,
        (accountExperience) => accountExperience.custom_job_application_submit,
        { cascade: true },
    )
    accountExperience: AccountExperience[]; // List of experience details of the applicant
    @OneToMany(
        () => AccountResume,
        (accountResume) => accountResume.custom_job_application_submit,
        { cascade: true },
    )
    accountResume: AccountResume[]; // List of resume details of the applicant
}
