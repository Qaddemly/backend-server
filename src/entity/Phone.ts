import {
    Column,
    Entity,
    OneToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CountryCode } from '../enums/countryCode';
@Entity()
export class Phone {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'enum', enum: CountryCode, nullable: true })
    country_code: number;

    @Column({ type: 'text', nullable: true })
    number: string;
}
