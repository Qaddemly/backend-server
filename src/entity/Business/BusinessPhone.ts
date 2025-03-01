import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from './Business';
import { CountryCode } from '../../enums/countryCode';

@Entity()
export class BusinessPhone {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'business_id' })
    businessId: number;

    @Index('business_phone_idx_on_business_id')
    @ManyToOne(() => Business, (business) => business.phones, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({
        name: 'business_id',
        foreignKeyConstraintName: 'FK_BUSINESS_PHONE',
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
