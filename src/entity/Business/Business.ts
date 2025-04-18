import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Review } from '../General/Review';
import { LocationType } from '../../enums/locationType';
import { HrEmployee } from './HrEmployee';
import { FollowBusiness } from '../General/FollowBusiness';
import { Job } from '../Job/Job';
import { Address } from '../General/Address';
import { BusinessPhone } from './BusinessPhone';
import { JobApplicationState } from '../Job/JobApplicationStates';
import { Notification } from '../Notification/Notification';
import { CustomJobApplication } from '../Job/customJobApplication';

@Entity()
export class Business {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    logo: string;

    @Column('text')
    CEO: string;

    @Column('text')
    founder: string;

    @Column('date')
    founded: Date;

    @Column(() => Address, { prefix: false })
    address: Address;

    @Column({
        type: 'enum',
        enum: LocationType,
        default: LocationType.Onsite,
    })
    location_type: LocationType;

    @Column('text')
    description: string;

    @Column('integer')
    company_size: number;

    /**
     * TODO: Convert this to enum
     * */
    @Column('text')
    industry: string;

    @Column('text', { nullable: true })
    website: string;

    @Column('text')
    headquarter: string;

    @Column('text', { nullable: true })
    email: string;

    @OneToMany(
        () => BusinessPhone,
        (businessPhones) => businessPhones.business,
        { cascade: true },
    )
    phones: BusinessPhone[];

    @OneToMany(() => Review, (review) => review.business, { cascade: true })
    reviews: Review[];

    @Column({ type: 'float', default: 0.0 })
    reviewsRatingsQuantity: number;

    @Column({ type: 'float', default: 0.0 })
    reviewsRatingsAverage: number;

    @OneToMany(
        () => FollowBusiness,
        (followBusiness) => followBusiness.business,
        { cascade: true },
    )
    followers: FollowBusiness[];

    @OneToMany(() => HrEmployee, (hr_employee) => hr_employee.business, {
        cascade: true,
    })
    hr_employees: HrEmployee[];

    @OneToMany(() => Job, (job) => job.business, { cascade: true })
    jobs: Job[];
    @OneToMany(() => Notification, (notification) => notification.business)
    notifications: Notification[];
    @OneToMany(
        () => CustomJobApplication,
        (custom_job_application) => custom_job_application.business,
    )
    custom_job_applications: CustomJobApplication[];
    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
