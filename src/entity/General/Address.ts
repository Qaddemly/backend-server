import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Country } from '../../enums/country';

export class Address {
    // Account has only 1 one address
    // And Account has Address, not address has an account

    @Column({ type: 'enum', enum: Country, nullable: true })
    country: string;

    @Column({ type: 'text', nullable: true })
    city: string;
}
