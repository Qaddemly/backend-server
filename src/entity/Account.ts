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
