import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SkillLevel } from '../../enums/skillLevel';

@Entity()
export class ResumeTemplateSkill {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: false })
    name: string;
    @Column({ nullable: true })
    Information: string;
    @Column({ type: 'enum', enum: SkillLevel })
    level: SkillLevel;
}
