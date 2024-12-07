import {
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from './Business';
import { Account } from './Account';

@Entity()
export class FollowBusiness {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Business)
    business: Business;

    @ManyToOne(() => Account)
    account: Account;
}
