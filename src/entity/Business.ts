import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review';
import { LocationType } from '../enums/locationType';
import { HrEmployee } from './HrEmployee';
import { FollowBusiness } from './FollowBusiness';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Job } from './Job';
import { Address } from './Address';

/**
 * TODO: add fields of CEO, FOUNDER, FOUNDED
 * TODO: remove specialities and add tags
 * TODO: phone number optional
 * TODO: email optional
 * TODO: website optional
 * */

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

    @Column(() => Address)
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

    @Column('text', { nullable: true })
    phone: string;

    @OneToMany(() => Review, (review) => review.business, { cascade: true })
    reviews: Review[];

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
}
