import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PersonalDetails } from './PersonalDetails';
import { Account } from '../Account/Account';
import { RecipientDetails } from './RecipientDetails';
@Entity()
export class CoverLetter {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: 'account_id' })
    account_id: number;
    @Column({ nullable: true })
    name: string;
    @Column({ default: new Date(), type: 'date' })
    date: Date;
    @Column(() => RecipientDetails, { prefix: false })
    recipientDetails: RecipientDetails;
    @OneToOne(
        () => PersonalDetails,
        (personalDetails) => personalDetails.coverLetter,
        { onDelete: 'CASCADE' },
    )
    personalDetails: PersonalDetails;
    @ManyToOne(() => Account, (account) => account.coverLetters, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_ACCOUNT_COVER_LETTER',
    })
    account: Account;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
