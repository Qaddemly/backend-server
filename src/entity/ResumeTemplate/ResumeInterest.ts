import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ResumeTemplate } from './ResumeTemplate';

@Entity()
export class ResumeInterest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'resume_template_id' })
    resume_template_id: number;

    @ManyToOne(
        () => ResumeTemplate,
        (resume_template) => resume_template.interests,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'resume_template_id',
        foreignKeyConstraintName: 'FK_RESUME_TEMPLATE_INTEREST',
    })
    resume_template: ResumeTemplate;

    @Column({ type: 'text', nullable: true })
    interest: string;

    @Column({ type: 'text', nullable: true })
    description: string;
}
