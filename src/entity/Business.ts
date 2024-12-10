import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review';
import { LocationType } from '../enums/locationType';
import { HrEmployee } from './HrEmployee';
import { FollowBusiness } from './FollowBusiness';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Job } from './Job';

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

    @IsNotEmpty({ message: 'Website is required' })
    @IsString({ message: 'Website must be a string' })
    @Column('text')
    website: string;

    @IsNotEmpty({ message: 'Headquarter is required' })
    @IsString({ message: 'Headquarter must be a string' })
    @Column('text')
    headquarter: string;

    // @OneToMany(() => Speciality, (speciality) => speciality.id, {
    //     cascade: true,
    // })
    // specialities: Speciality[];

    @Column('text', { array: true })
    specialities: string[];

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email' })
    @Column('text')
    email: string;

    @IsNotEmpty({ message: 'Phone is required' })
    @IsString({ message: 'Phone must be a string' })
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

    @OneToMany(() => Job, (job) => job.business, { cascade: true })
    jobs: Job[];
}
