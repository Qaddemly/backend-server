import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ResumeTemplate } from './ResumeTemplate';

@Entity()
export class ResumeTemplateProject {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: false })
    title: string;
    @Column({ nullable: true })
    subtitle: string;
    @Column({ nullable: true })
    project_link: string;

    @Column({ type: 'varchar', nullable: true })
    start_date: string;

    @Column({ type: 'varchar', nullable: true })
    end_date: string;

    @Column({ default: false })
    is_current: boolean;

    @Column({ type: 'text', nullable: true })
    description: string;

    @ManyToOne(
        () => ResumeTemplate,
        (resumeTemplate) => resumeTemplate.projects,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'resume_template_id',
    })
    resumeTemplate: ResumeTemplate;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
