import {
    Column,
    Entity,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';

@Entity()
export class Education {
    // Account has only 1 education
    // Account has education, not education has an account
    // So Foreign key must be in the education side
    //@OneToOne(() => Account, (account) => account.id)
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    university: string;

    @Column('text')
    field_of_study: string;

    @Column('float')
    gpa: number;

    @Column('date')
    start_date: Date;

    @Column('date')
    end_date: Date;
}
