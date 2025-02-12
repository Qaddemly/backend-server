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

@Entity()
export class Account {
    @Index('account_idx_on_id', { unique: true })
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    first_name: string;

    @Column({ type: 'text' })
    last_name: string;

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

    @Column('text', { nullable: true })
    resume: string;
    @Column({ nullable: true })
    about_me: string;
    @Column({ nullable: true })
    subtitle: string;
    @Column({ type: 'text', array: true, nullable: true })
    links: string[];

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

    @ManyToMany(() => JobApplication)
    @JoinTable({
        name: 'account_job_applications',
        joinColumn: { name: 'account_id', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'job_application_id',
            referencedColumnName: 'id',
        },
    })
    job_applications: JobApplication[];

    @ManyToMany(() => Job, (job) => job.saved_by_accounts)
    @JoinTable({
        name: 'account_saved_jobs',
        joinColumn: { name: 'account_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'job_id', referencedColumnName: 'id' },
    })
    saved_jobs: Job[];

    @OneToMany(
        () => FollowBusiness,
        (follow_business) => follow_business.account,
        { cascade: true },
    )
    follow_businesses: FollowBusiness[];

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
