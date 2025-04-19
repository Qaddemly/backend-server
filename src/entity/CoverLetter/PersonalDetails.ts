import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CoverLetter } from './CoverLetter';

@Entity()
export class PersonalDetails {
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
    @OneToOne(() => CoverLetter, (coverLetter) => coverLetter.personalDetails, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'cover_letter_id' })
    coverLetter: CoverLetter;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
