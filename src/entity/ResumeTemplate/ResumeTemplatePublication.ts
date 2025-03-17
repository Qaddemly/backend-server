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
export class ResumeTemplatePublication {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: true })
    title: string;
    @Column({ nullable: true })
    publication_url: string;
    @Column({ nullable: true })
    publisher: string;
    @Column({ type: 'date', nullable: true })
    date: Date;
    @Column({ nullable: true })
    description: string;
    @ManyToOne(
        () => ResumeTemplate,
        (resumeTemplate) => resumeTemplate.publications,
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
