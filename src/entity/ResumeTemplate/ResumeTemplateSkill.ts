import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SkillLevel } from '../../enums/skillLevel';
import { ResumeTemplate } from './ResumeTemplate';

@Entity()
export class ResumeTemplateSkill {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: false })
    name: string;
    @Column({ nullable: true })
    information: string;
    @Column({ nullable: true })
    level: string;
    @ManyToOne(
        () => ResumeTemplate,
        (resumeTemplate) => resumeTemplate.skills,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'resume_template_id',
    })
    resumeTemplate: ResumeTemplate;
}
