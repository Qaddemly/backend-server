import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ResumeTemplate } from './ResumeTemplate';

@Entity()
export class ResumeReference {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'resume_template_id' })
    resume_template_id: number;

    @ManyToOne(
        () => ResumeTemplate,
        (resume_template) => resume_template.references,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'resume_template_id',
        foreignKeyConstraintName: 'FK_RESUME_TEMPLATE_REFERENCE',
    })
    resume_template: ResumeTemplate;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'text', nullable: true })
    job_title: string;

    @Column({ type: 'text', nullable: true })
    organization: string;

    @Column({ type: 'text', nullable: true })
    email: string;

    @Column({ type: 'text', nullable: true })
    phone: string;
}
