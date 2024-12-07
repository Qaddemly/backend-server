import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from './Business';
import { Account } from './Account';
import { HrRole } from '../enums/HrRole';

@Entity()
export class HrEmployee {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Business, (business) => business.hr_employees, {
        onDelete: 'CASCADE',
    })
    business: Business;

    @ManyToOne(() => Account, (account) => account.business_roles, {
        onDelete: 'CASCADE',
    })
    account: Account;

    @Column({
        type: 'enum',
        enum: HrRole,
        default: HrRole.HR,
    })
    role: HrRole;
}
