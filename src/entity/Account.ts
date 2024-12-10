import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'text' })
    firstName: string;
    @Column({ type: 'text' })
    lastName: string;
    @Column({ type: 'text', unique: true })
    email: string;
    @Column({ type: 'text' })
    password: string;
    @Column('date', { nullable: true })
    dateOfBirth: Date;
    @Column('text', { nullable: true })
    profilePicture: string;
    @Column('text', { nullable: true })
    resume: string;
    @Column({
        type: 'timestamptz',
        default: new Date(Date.now()),
    })
    passwordChangedAt: Date;
    @Column('bool', { default: true })
    isActivated: boolean;
}
