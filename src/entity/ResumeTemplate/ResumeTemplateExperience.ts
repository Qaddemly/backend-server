import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ResumeTemplate } from './ResumeTemplate';

@Entity()
export class ResumeTemplateExperience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'resume_template_id' })
    resume_template_id: number;

    @Column({ type: 'text', nullable: true })
    job_title: string;

    @Column({ type: 'text', nullable: true })
    company_name: string;

    @Column({ type: 'text', nullable: true })
    city: string;

    @Column({ type: 'text', nullable: true })
    country: string;

    @Column({ type: 'date', nullable: true })
    start_date: Date;

    @Column({ type: 'date', nullable: true })
    end_date: Date;

    @Column({ type: 'boolean', nullable: true, default: false })
    is_current: boolean;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(
        () => ResumeTemplate,
        (resume_template) => resume_template.experiences,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'resume_template_id',
        foreignKeyConstraintName: 'FK_RESUME_TEMPLATE_EXPERIENCE',
    })
    resume_template: ResumeTemplate;
}
