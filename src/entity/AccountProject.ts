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
export class AccountProject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'account_id' })
    account_id: number;

    @Index('account_project_idx')
    @ManyToOne(() => Account, (account) => account.projects, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_ACCOUNT_PROJECT',
    })
    account: Account;

    @Column({
        type: 'text',
        nullable: false,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'text',
        array: true,
        nullable: true,
    })
    skills: string[];

    @Column({
        type: 'date',
        nullable: true,
    })
    start_date: Date;

    @Column({
        type: 'date',
        nullable: true,
    })
    end_date: Date;

    @Column({
        type: 'boolean',
        nullable: true,
    })
    still_working: boolean;

    @Column({ type: 'text', nullable: true })
    link: string;

    // TODO
    // @Column()
    // associated_with_type: 'Education' | 'Experience';
    //
    // // Will be a foreign key to (education or experience)
    // @Column({ type: 'integer' })
    // associated_with: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
