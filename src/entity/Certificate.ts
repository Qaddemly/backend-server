import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';

@Entity({ name: 'account_certificate' })
export class Certificate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    issuing_organization: string;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column()
    media: string;

    @Column({ name: 'account_id' })
    account_id: number;

    @Index('certificate_idx_on_account_id')
    @ManyToOne(() => Account, (account) => account.certificates, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'account_id' })
    account: Account;
}
