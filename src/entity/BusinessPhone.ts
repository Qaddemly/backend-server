import {
    Column,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from './Business';
import { CountryCode } from '../enums/countryCode';

@Entity()
export class BusinessPhone {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Business, (business) => business.phones, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    business: Business;

    @Column({
        type: 'enum',
        enum: CountryCode,
        nullable: false,
    })
    country_code: CountryCode;

    @Column({ type: 'text', nullable: false })
    phone_number: string;
}
