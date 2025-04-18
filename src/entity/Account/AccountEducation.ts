import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';
import { CustomJobApplicationSubmit } from '../Job/customJobApplicatoinsSubmit';

@Entity({ name: 'account_education' })
export class AccountEducation {
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

    @Index('education_idx_on_account_id')
    @ManyToOne(() => Account, (account) => account.educations, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_EDUCATION_ACCOUNT',
    })
    account: Account;
    @ManyToOne(
        () => CustomJobApplicationSubmit,
        (customJobApplicationSubmit) =>
            customJobApplicationSubmit.accountEducation,
    )
    @JoinColumn({ name: 'custom_job_application_submit_id' }) // Links to CustomJobApplicationSubmit
    custom_job_application_submit: CustomJobApplicationSubmit; // Foreign key to CustomJobApplicationSubmit
}
