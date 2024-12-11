import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Education {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    university: string;

    @Column('text')
    field_of_study: string;

    @Column('float')
    gpa: number;

    @Column('date')
    start_date: Date;

    @Column('date')
    end_date: Date;
}
