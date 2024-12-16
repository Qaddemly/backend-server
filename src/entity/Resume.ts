import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';
import { JobApplication } from './JobApplication';
@Entity()
export class Resume {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Account, (account) => account.resumes, {
        onDelete: 'CASCADE',
    })
    account: Account;
    @OneToMany(
        () => JobApplication,
        (job_application) => job_application.resume,
        {
            onDelete: 'CASCADE',
        },
    )
    job_applications: JobApplication[];
    @Column('text')
    url: string;
}
