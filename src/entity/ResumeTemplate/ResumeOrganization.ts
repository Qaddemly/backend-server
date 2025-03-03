import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ResumeTemplate } from './ResumeTemplate';

@Entity()
export class ResumeOrganization {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'resume_template_id' })
    resume_template_id: number;

    @ManyToOne(
        () => ResumeTemplate,
        (resume_template) => resume_template.organizations,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'resume_template_id',
        foreignKeyConstraintName: 'FK_RESUME_TEMPLATE_ORGANIZATION',
    })
    resume_template: ResumeTemplate;

    @Column({ type: 'text' })
    organization: string;

    @Column({ type: 'text', nullable: true })
    position: string;

    @Column({ type: 'text', nullable: true })
    city: string;

    @Column({ type: 'text', nullable: true })
    country: string;

    @Column({ type: 'date', nullable: true })
    start_date: Date;

    @Column({ type: 'date', nullable: true })
    end_date: Date;

    @Column({ type: 'boolean', nullable: true })
    is_current: boolean;

    @Column({ type: 'text', nullable: true })
    description: string;
}
