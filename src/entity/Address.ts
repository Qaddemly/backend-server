import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Country } from '../enums/country';
import { Account } from './Account';

export class Address {
    // Account has only 1 one address
    // And Account has Address, not address has an account

    @Column({ type: 'enum', enum: Country })
    country: Country;

    @Column({ type: 'text' })
    city: string;
}
