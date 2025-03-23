import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SkillLevel } from '../../enums/skillLevel';
import { ResumeTemplate } from './ResumeTemplate';

@Entity()
export class ResumeTemplatePersonalInfo {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: true })
    full_name: string;
    @Column({ nullable: true })
    job_title: string;
    @Column({ nullable: true })
    email: string;
    @Column({ nullable: true })
    phone_number: string;
    @Column({ nullable: true })
    address: string;
    @Column({ type: 'json', nullable: true })
    personal_information: { [key: string]: any };
    @Column({ nullable: true })
    picture: string;
    @Column({ nullable: true, type: 'json' })
    links: { [key: string]: any };
    @OneToOne(
        () => ResumeTemplate,
        (resumeTemplate) => resumeTemplate.personalInfo,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'resume_template_id' })
    resumeTemplate: ResumeTemplate;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
