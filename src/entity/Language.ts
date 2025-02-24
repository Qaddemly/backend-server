import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Language as Lang } from '../enums/language';
import { Account } from './Account';
@Entity()
export class Language {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'account_id' })
    account_id: number;

    @ManyToOne(() => Account, (account) => account.languages, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_LANGUAGE_ACCOUNT',
    })
    account: Account;

    @Column({ type: 'enum', enum: Lang })
    name: Lang;
}
