import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    @Column({ nullable: true })
    start_date: Date;
    @Column({ nullable: true })
    end_date: Date;
    @Column({ nullable: true })
    current_study: Date;
    @Column({ nullable: true })
    description: string;
}
