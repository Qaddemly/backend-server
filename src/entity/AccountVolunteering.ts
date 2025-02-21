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
import { Account } from './Account';

@Entity()
export class AccountVolunteering {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'account_id' })
    account_id: number;

    @Index('account_volunteering_idx')
    @ManyToOne(() => Account, (account) => account.volunteering, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_ACCOUNT_VOLUNTEERING',
    })
    account: Account;

    @Column({ type: 'text', nullable: false })
    organization: string;

    @Column({ type: 'text', nullable: false })
    role: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'date', nullable: true })
    start_date: Date;

    @Column({ type: 'date', nullable: true })
    end_date: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
