import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ResumeTemplatePersonalInfo } from './ResumeTemplatePersonalInfo';
import { ResumeTemplateSkill } from './ResumeTemplateSkill';

import { Account } from '../Account/Account';
import { ResumeTemplateExperience } from './ResumeTemplateExperience';
import { ResumeLanguage } from './ResumeLanguage';
import { ResumeInterest } from './ResumeInterest';
import { ResumeCourse } from './ResumeCourse';
import { ResumeOrganization } from './ResumeOrganization';
import { ResumeReference } from './ResumeReference';
import { ResumeCustomSection } from './ResumeCustomSection';
import { ResumeTemplateEducation } from './ResumeTemplateEducation';
import { ResumeTemplateCertificate } from './ResumeTemplateCertificate';

@Entity()
export class ResumeTemplate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'account_id' })
    account_id: number;

    @ManyToOne(() => Account, (account) => account.resume_templates, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({
        name: 'account_id',
        foreignKeyConstraintName: 'FK_ACCOUNT_RESUME_TEMPLATE',
    })
    account: Account;
    @OneToOne(
        () => ResumeTemplatePersonalInfo,
        (personaInfo) => personaInfo.resumeTemplate,
    )
    personalInfo: ResumeTemplatePersonalInfo;
    @OneToMany(() => ResumeTemplateSkill, (skill) => skill.resumeTemplate)
    skills: ResumeTemplateSkill[];
    @OneToMany(
        () => ResumeTemplateEducation,
        (education) => education.resumeTemplate,
    )
    educations: ResumeTemplateEducation[];
    @OneToMany(
        () => ResumeTemplateCertificate,
        (certificate) => certificate.resumeTemplate,
    )
    certificates: ResumeTemplateCertificate[];
    @Column({ type: 'text', nullable: true })
    profile: string;

    @OneToMany(
        () => ResumeTemplateExperience,
        (experience) => experience.resume_template,
        { cascade: true },
    )
    experiences: ResumeTemplateExperience[];

    @OneToMany(() => ResumeLanguage, (language) => language.resume_template, {
        cascade: true,
    })
    languages: ResumeLanguage[];

    @OneToMany(() => ResumeInterest, (interest) => interest.resume_template, {
        cascade: true,
    })
    interests: ResumeInterest[];

    @OneToMany(() => ResumeCourse, (course) => course.resume_template, {
        cascade: true,
    })
    courses: ResumeCourse[];

    @OneToMany(
        () => ResumeOrganization,
        (organization) => organization.resume_template,
        {
            cascade: true,
        },
    )
    organizations: ResumeOrganization[];

    @OneToMany(
        () => ResumeReference,
        (reference) => reference.resume_template,
        {
            cascade: true,
        },
    )
    references: ResumeReference[];

    @OneToMany(
        () => ResumeCustomSection,
        (custom_section) => custom_section.resume_template,
        {
            cascade: true,
        },
    )
    custom_sections: ResumeCustomSection[];

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
