import {
    Column,
    Entity,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from '../enums/country';
@Entity()
export class Address {
    // Account has only 1 one address
    // And Account has Address, not address has an account
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'enum', enum: Country, nullable: true })
    country: string;

    @Column({ type: 'text', nullable: true })
    city: string;
}
