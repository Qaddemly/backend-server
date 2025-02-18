import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';
import { JobApplication } from './JobApplication';

@Entity()
export class AccountArchivedJobApplications {
    @PrimaryColumn()
    job_application_id: number; // Single column as both Primary & Foreign Key

    @OneToOne(() => JobApplication, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_application_id' }) // Links to JobApplication
    job_application: JobApplication;

    @ManyToOne(() => Account, (account) => account.archived_job_applications, {
        onDelete: 'CASCADE',
    })
    account: Account;

    @Column('boolean')
    is_archived: boolean;
}
