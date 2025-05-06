import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { JobApplicationStateEnum } from '../../../enums/jobApplicationStateEnum';
import { JobApplication } from './JobApplication';

@Entity()
export class JobApplicationState {
    @PrimaryColumn()
    job_application_id: number; // Single column as both Primary & Foreign Key

    @OneToOne(() => JobApplication, (ja) => ja.job_application_state, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'job_application_id' }) // Links to JobApplication
    job_application: JobApplication;

    @Column({
        type: 'enum',
        enum: JobApplicationStateEnum,
        default: JobApplicationStateEnum.PENDING,
    })
    state: JobApplicationStateEnum;
}
