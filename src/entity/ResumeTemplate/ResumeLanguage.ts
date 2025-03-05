import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ResumeTemplate } from './ResumeTemplate';
import { LanguageLevel } from '../../enums/languageLevel';

@Entity()
export class ResumeLanguage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'resume_template_id' })
    resume_template_id: number;

    @ManyToOne(
        () => ResumeTemplate,
        (resume_template) => resume_template.languages,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'resume_template_id',
        foreignKeyConstraintName: 'FK_RESUME_TEMPLATE_LANGUAGE',
    })
    resume_template: ResumeTemplate;

    @Column({ type: 'text', nullable: true })
    language: string;

    @Column({ type: 'text', nullable: true })
    additional_info: string;

    @Column({ type: 'enum', enum: LanguageLevel, nullable: true })
    level: LanguageLevel;
}
