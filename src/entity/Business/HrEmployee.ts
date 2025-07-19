import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Business } from './Business';
import { Account } from '../Account/Account';
import { HrRole } from '../../enums/HrRole';

@Entity()
export class HrEmployee {
    @PrimaryColumn({ name: 'account_id' })
    account_id: number;

    @PrimaryColumn({ name: 'business_id' })
    business_id: number;

    @Index('hr_employee_idx_on_business_id')
    @ManyToOne(() => Business, (business) => business.hr_employees, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'business_id',
        foreignKeyConstraintName: 'FK_HR_EMPLOYEE_BUSINESS',
    })
    business: Business;

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
