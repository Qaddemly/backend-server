import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { Country } from '../enums/country';
import { Account } from './Account';

@Entity()
export class Address {
    // Account has only 1 one address
    // And Account has Address, not address has an account

    @OneToOne(() => Account, (account) => account.id)
    @PrimaryColumn({ type: 'integer' })
    account_id: number;

    @Column({ type: 'enum', enum: Country })
    country: Country;

    @Column({ type: 'text' })
    city: string;
}
