import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from './Business';

@Entity()
export class Speciality {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @ManyToOne(() => Business, (business) => business.specialities, {
        onDelete: 'CASCADE',
    })
    business: Business;
}
