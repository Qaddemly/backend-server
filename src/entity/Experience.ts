import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EmploymentType } from '../enums/employmentType';
import { LocationType } from '../enums/locationType';

@Entity()
export class Experience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    job_title: string;

    @Column({ type: 'enum', enum: EmploymentType })
    employment_type: EmploymentType;

    @Column('text')
    company_name: string;

    @Column('text')
    location: string;

    @Column({ type: 'enum', enum: LocationType })
    location_type: LocationType;

    @Column('bool')
    still_working: boolean;

    @Column('date')
    start_date: Date;

    @Column('date')
    end_date: Date;
}
