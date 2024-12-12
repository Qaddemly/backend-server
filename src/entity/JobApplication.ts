import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Job } from './Job';

@Entity()
export class JobApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Job, (job) => job.job_applications, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'job_id',
        foreignKeyConstraintName: 'FK_JOB_APPLICATION_JOB',
    })
    job: Job;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
