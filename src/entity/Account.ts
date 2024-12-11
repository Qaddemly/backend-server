import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './Review';
import { HrEmployee } from './HrEmployee';
import { FollowBusiness } from './FollowBusiness';
import { JobApplication } from './JobApplication';
import { Address } from './Address';
import { Education } from './Education';
import { Experience } from './Experience';
import { Language } from './Language';
import { Skill } from './skill';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    first_name: string;

    @Column({ type: 'text' })
    last_name: string;

    @Column({ type: 'text', unique: true })
    email: string;

    @Column({ type: 'text' })
    password: string;

    @Column('date', { nullable: true })
    date_of_birth: Date;

    @Column('text', { nullable: true })
    profile_picture: string;

    @Column('text', { nullable: true })
    resume: string;

    @Column({
        type: 'timestamptz',
        default: new Date(Date.now()),
    })
    password_changed_at: Date;

    @Column('bool', { default: true })
    is_activated: boolean;

    @OneToMany(() => Experience, (experience) => experience.account, {
        cascade: true,
    })
    experiences: Experience[];

    @OneToMany(() => Language, (language) => language.account, {
        cascade: true,
    })
    languages: Language[];

    @OneToMany(() => Skill, (skill) => skill.account, { cascade: true })
    skills: Skill[];

    @ManyToMany(() => JobApplication)
    @JoinTable({ name: 'account_job_applications' })
    job_applications: JobApplication[];

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
}
