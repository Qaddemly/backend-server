
import {
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Review } from './Review';
import { HrEmployee } from './HrEmployee';
import { FollowBusiness } from './FollowBusiness';
import { JobApplication } from './JobApplication';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'text' })
    firstName: string;
    @Column({ type: 'text' })
    lastName: string;
    @Column({ type: 'text', unique: true })
    email: string;
    @Column({ type: 'text' })
    password: string;
    @Column('date', { nullable: true })
    dateOfBirth: Date;
    @Column('text', { nullable: true })
    profilePicture: string;
    @Column('text', { nullable: true })
    resume: string;
    @Column({
        type: 'timestamptz',
        default: new Date(Date.now()),
    })
    passwordChangedAt: Date;
    @Column('bool', { default: true })
    isActivated: boolean;

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
