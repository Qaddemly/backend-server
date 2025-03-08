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
export class ResumeTemplateCertificate {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: false })
    certificate: string;
    @Column({ nullable: true })
    certificate_url: string;
    @Column({ nullable: true })
    additional_information: string;
    @ManyToOne(
        () => ResumeTemplate,
        (resumeTemplate) => resumeTemplate.certificates,
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
