import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Business } from './Business';
import { Account } from './Account';
import { HrRole } from '../enums/HrRole';

@Entity()
export class HrEmployee {
    @PrimaryGeneratedColumn()
    id: number;

    @Index('hr_employee_idx_on_business_id')
    @ManyToOne(() => Business, (business) => business.hr_employees, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'business_id',
        foreignKeyConstraintName: 'FK_HR_EMPLOYEE_BUSINESS',
    })
    business: Business;

    @Index('hr_employee_idx_on_account_id')
    @ManyToOne(() => Account, (account) => account.business_roles, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_HR_EMPLOYEE_ACCOUNT',
    })
    account: Account;

    @Column({
        type: 'enum',
        enum: HrRole,
        default: HrRole.HR,
    })
    role: HrRole;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
