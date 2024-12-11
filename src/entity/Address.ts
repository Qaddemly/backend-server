import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from '../enums/country';

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: Country })
    country: Country;

    @Column({ type: 'text' })
    city: string;
}
