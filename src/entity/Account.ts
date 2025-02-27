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
import { Review } from './Review';
import { HrEmployee } from './HrEmployee';
import { FollowBusiness } from './FollowBusiness';
import { JobApplication } from './JobApplication';
import { Address } from './Address';
import { Education } from './Education';
import { Experience } from './Experience';
import { Language } from './Language';
import { Skill } from './Skill';
import { Job } from './Job';
import { Phone } from './Phone';
import { Resume } from './Resume';

import { Certificate } from './Certificate';

import { AccountProject } from './AccountProject';
import { AccountVolunteering } from './AccountVolunteering';
import { AccountArchivedJobApplications } from './AccountArchivedJobApplications';
import { AccountSavedJobs } from './AccountSavedJobs';
import { AccountLinks } from './AccountLinks';

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

    @OneToMany(() => Experience, (experience) => experience.account, {
        cascade: true,
    })
    experiences: Experience[];

    @OneToMany(() => Education, (education) => education.account, {
        cascade: true,
    })
    educations: Education[];

    @OneToMany(() => Language, (language) => language.account, {
        cascade: true,
    })
    languages: Language[];

    @OneToMany(() => Resume, (resume) => resume.account, {
        cascade: true,
    })
    resumes: Resume[];

    @OneToMany(() => Skill, (skill) => skill.account, { cascade: true })
    skills: Skill[];

    @OneToMany(
        () => JobApplication,
        (jobApplication) => jobApplication.account,
        { cascade: true },
    )
    job_applications: JobApplication[];

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

    @OneToMany(() => Review, (review) => review.account, { cascade: true })
    reviews: Review[];

    @OneToMany(() => HrEmployee, (hr_employee) => hr_employee.account, {
        cascade: true,
    })
    business_roles: HrEmployee[];

    @OneToMany(() => Certificate, (Certificate) => Certificate.account, {
        cascade: true,
    })
    certificates: Certificate[];

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

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
