import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../Account/Account';
import { ResumeTemplatePersonalInfo } from './ResumeTemplatePersonalInfo';

@Entity()
export class ResumeTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'account_id' })
    account_id: number;

    // @Index('projects_idx_on_account_id')
    // @ManyToOne(() => Account, (account) => account.projects, {
    //     onDelete: 'CASCADE',
    // })
    // @JoinColumn({
    //     name: 'account_id',
    //     foreignKeyConstraintName: 'FK_ACCOUNT_PROJECT',
    // })

    @ManyToOne(() => Account, (account) => account.resume_templates, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_ACCOUNT_RESUME_TEMPLATE',
    })
    account: Account;
    @OneToOne(
        () => ResumeTemplatePersonalInfo,
        (personaInfo) => personaInfo.resumeTemplate,
    )
    personalInfo: ResumeTemplatePersonalInfo;
}
