import {
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Speciality } from './Specialitie';
import { Review } from './Review';
import { Account } from './Account';
import { JoinTable } from 'typeorm/browser';
import { LocationType } from '../enums/locationType';
import { HrEmployee } from './HrEmployee';
import { FollowBusiness } from './FollowBusiness';

@Entity()
export class Business {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    company_name: string;

    @Column('text')
    location: string;

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

    @Column('text')
    industry: string;

    @Column('text')
    website: string;

    @Column('text')
    headquarter: string;

    @OneToMany(() => Speciality, (speciality) => speciality.id, {
        cascade: true,
    })
    specialities: Speciality[];

    @Column('text')
    email: string;

    @Column('text')
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
}
