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
import { Notification } from '../../Notification/Notification';
import { CustomJobApplicationSubmit } from './CustomJobApplicationSubmit';

@Entity()
export class CustomJobApplicationState {
    @PrimaryColumn()
    custom_job_application_submit_id: number; // Single column as both Primary & Foreign Key

    @OneToOne(
        () => CustomJobApplicationSubmit,
        (cja) => cja.custom_job_application_state,
        {
            cascade: true,
        },
    )
    @JoinColumn({ name: 'custom_job_application_submit_id' }) // Links to CustomJobApplication
    custom_job_application_submit: CustomJobApplicationSubmit;

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
