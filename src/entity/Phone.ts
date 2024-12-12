import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { CountryCode } from '../enums/countryCode';

export class Phone {
    @Column({ type: 'enum', enum: CountryCode, nullable: true })
    country_code: string;

    @Column({ type: 'text', nullable: true })
    number: string;
}
