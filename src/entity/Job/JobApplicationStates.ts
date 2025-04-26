import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../Account/Account';
import { JobApplication } from './JobApplication';
import { Business } from '../Business/Business';
import { JobApplicationStateEnum } from '../../enums/jobApplicationStateEnum';
import { Job } from './Job';
import { Notification } from '../Notification/Notification';

@Entity()
export class JobApplicationState {
    @PrimaryColumn()
    job_application_id: number; // Single column as both Primary & Foreign Key

    @OneToOne(() => JobApplication, (ja) => ja.job_application_state, {
        cascade: true,
    })
    @JoinColumn({ name: 'job_application_id' }) // Links to JobApplication
    job_application: JobApplication;

    @Column({ name: 'job_id' })
    job_id: number;

    @Index('job_application_state_idx_on_job_id')
    @ManyToOne(() => Job, (job) => job.job_application_states, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'job_id' })
    job: Job;
    @OneToMany(
        () => Notification,
        (notification) => notification.job_application_state,
    )
    notifications: Notification[];
    @Column({
        type: 'enum',
        enum: JobApplicationStateEnum,
        default: JobApplicationStateEnum.PENDING,
    })
    state: JobApplicationStateEnum;
}
