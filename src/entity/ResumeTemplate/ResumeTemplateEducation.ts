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
export class ResumeTemplateEducation {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: true })
    degree: string;
    @Column({ nullable: true })
    school: string;
    @Column({ nullable: true })
    school_link: string;
    @Column({ nullable: true })
    city: string;
    @Column({ nullable: true })
    country: string;
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
        (resumeTemplate) => resumeTemplate.educations,
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
