import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { LocationType } from '../enums/locationType';

@Entity()
export class Business {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    companyName: string;

    @Column('text')
    location: string;

    @Column({
        type: 'enum',
        enum: LocationType,
        default: LocationType.Onsite,
    })
    locationType: LocationType;

    @Column('text')
    description: string;

    @Column('integer')
    companySize: number;

    @Column('text')
    industry: string;

    @Column('text')
    website: string;

    @Column('text')
    headquarter: string;

    // OneToMany (Later)
    @Column('text')
    specialities: string;

    @Column('text')
    email: string;

    @Column('text')
    phone: string;

    // OneToMany (Later)
    @Column('text')
    reviews: string;

    // OneToMany (Later)
    @Column('text')
    followers: string;

    // OneToMany (Later)
    @Column('text')
    hrEmployees: string;
}
