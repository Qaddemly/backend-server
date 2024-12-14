import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EmploymentType } from '../enums/employmentType';
import { LocationType } from '../enums/locationType';
import { Account } from './Account';

@Entity()
export class Experience {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, (account) => account.experiences, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_EXPERIENCE_ACCOUNT',
    })
    account: Account;

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

    @Column('date', { nullable: true })
    end_date: Date;
}
