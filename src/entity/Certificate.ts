import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';

@Entity()
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
    @ManyToOne(() => Account, (account) => account.certificates, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'account_id' })
    account: Account;
}
