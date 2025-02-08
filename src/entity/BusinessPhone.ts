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
    @Index('business_phone_idx_on_id', { unique: true })
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
