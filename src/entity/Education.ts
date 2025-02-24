import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';

@Entity()
export class Education {
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

    @Column({ name: 'account_id' })
    account_id: number;

    @ManyToOne(() => Account, (account) => account.educations, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_EDUCATION_ACCOUNT',
    })
    account: Account;
}
