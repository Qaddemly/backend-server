import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Review } from '../General/Review';
import { HrEmployee } from '../Business/HrEmployee';
import { FollowBusiness } from '../General/FollowBusiness';
import { JobApplication } from '../Job/JobApplication';
import { Address } from '../General/Address';
import { AccountEducation } from './AccountEducation';
import { AccountExperience } from './AccountExperience';
import { AccountLanguage } from './AccountLanguage';
import { AccountSkill } from './AccountSkill';
import { Job } from '../Job/Job';
import { Phone } from '../General/Phone';
import { AccountResume } from './AccountResume';

import { AccountCertificate } from './AccountCertificate';

import { AccountProject } from './AccountProject';
import { AccountVolunteering } from './AccountVolunteering';
import { AccountArchivedJobApplications } from '../Job/AccountArchivedJobApplications';
import { AccountSavedJobs } from '../Job/AccountSavedJobs';
import { AccountLinks } from './AccountLinks';
import { ResumeTemplate } from '../ResumeTemplate/ResumeTemplate';
import { CoverLetter } from '../CoverLetter/CoverLetter';
import { Notification } from '../Notification/Notification';
import { CustomJobApplication } from '../Job/customJobApplication/CustomJobApplication';
import { CustomJobApplicationSubmit } from '../Job/customJobApplication/CustomJobApplicationSubmit';
import { AccountArchivedCustomJobApplications } from '../Job/customJobApplication/AccountArchivedCustomJobApplications';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    first_name: string;

    @Column({ type: 'text' })
    last_name: string;

    // This Index for searching for user using email in (Adding new HR to business)
    @Index('account_idx_on_email', { unique: true })
    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'text', nullable: true })
    password: string;

    @Column('date', { nullable: true })
    date_of_birth: Date;

    @Column('text', { nullable: true })
    profile_picture: string;

    @Column(() => Address, { prefix: false })
    address: Address;

    @Column(() => Phone, { prefix: false })
    phone: Phone;

    @Column({ nullable: true })
    about_me: string;

    @Column({ nullable: true })
    subtitle: string;

    @Column(() => AccountLinks, { prefix: false })
    links: AccountLinks;

    @Column({
        type: 'timestamptz',
        default: new Date(Date.now()),
    })
    password_changed_at: Date;

    @Column('bool', { default: false })
    is_activated: boolean;

    @OneToMany(() => AccountExperience, (experience) => experience.account, {
        cascade: true,
    })
    experiences: AccountExperience[];

    @OneToMany(() => AccountEducation, (education) => education.account, {
        cascade: true,
    })
    educations: AccountEducation[];

    @OneToMany(() => AccountLanguage, (language) => language.account, {
        cascade: true,
    })
    languages: AccountLanguage[];

    @OneToMany(() => AccountResume, (resume) => resume.account, {
        cascade: true,
    })
    resumes: AccountResume[];

    @OneToMany(() => AccountSkill, (skill) => skill.account, { cascade: true })
    skills: AccountSkill[];

    @OneToMany(
        () => JobApplication,
        (jobApplication) => jobApplication.account,
        { cascade: true },
    )
    job_applications: JobApplication[];

    @OneToMany(
        () => CustomJobApplicationSubmit,
        (custom_job_application_submit) =>
            custom_job_application_submit.account,
        { cascade: true },
    )
    custom_job_application_submits: CustomJobApplicationSubmit[];

    @OneToMany(
        () => AccountSavedJobs,
        (accountSavedJobs) => accountSavedJobs.account,
        { cascade: true },
    )
    saved_jobs: AccountSavedJobs[];

    @OneToMany(
        () => FollowBusiness,
        (follow_business) => follow_business.account,
        { cascade: true },
    )
    follow_businesses: FollowBusiness[];

    @OneToMany(
        () => AccountArchivedJobApplications,
        (account_archived_job_applications) =>
            account_archived_job_applications.account,
        { cascade: true },
    )
    archived_job_applications: AccountArchivedJobApplications[];

    @OneToMany(
        () => AccountArchivedCustomJobApplications,
        (account_archived_custom_job_applications) =>
            account_archived_custom_job_applications.account,
        { cascade: true },
    )
    archived_custom_job_applications: AccountArchivedCustomJobApplications[];

    @OneToMany(() => Review, (review) => review.account, { cascade: true })
    reviews: Review[];

    @OneToMany(() => HrEmployee, (hr_employee) => hr_employee.account, {
        cascade: true,
    })
    business_roles: HrEmployee[];

    @OneToMany(() => AccountCertificate, (Certificate) => Certificate.account, {
        cascade: true,
    })
    certificates: AccountCertificate[];

    @OneToMany(
        () => AccountProject,
        (accountProject) => accountProject.account,
        { cascade: true },
    )
    projects: AccountProject[];

    @OneToMany(
        () => AccountVolunteering,
        (accountVolunteering) => accountVolunteering.account,
        { cascade: true },
    )
    volunteering: AccountVolunteering[];

    @OneToMany(
        () => ResumeTemplate,
        (resumeTemplate) => resumeTemplate.account,
        { cascade: true },
    )
    resume_templates: ResumeTemplate[];
    @OneToMany(() => CoverLetter, (coverLetter) => coverLetter.account, {
        cascade: true,
    })
    coverLetters: CoverLetter[];
    @OneToMany(() => Notification, (notification) => notification.account)
    notifications: Notification[];
    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
