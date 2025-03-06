import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SkillLevel } from '../../enums/skillLevel';
import { ResumeTemplate } from './ResumeTemplate';

@Entity()
export class ResumeTemplateAward {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: false })
    award: string;
    @Column({ nullable: true })
    award_url: string;
    @Column({ nullable: true })
    issuer: string;
    @Column({ type: 'varchar', nullable: true })
    date: string;
    @Column({ nullable: true })
    description: string;
    @ManyToOne(
        () => ResumeTemplate,
        (resumeTemplate) => resumeTemplate.awards,
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
