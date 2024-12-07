import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Business } from './Business';
import { Account } from './Account';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    description: string;

    @Column('integer')
    rating: number;

    @ManyToOne(() => Business, (business) => business.reviews, {
        onDelete: 'CASCADE',
    })
    business: Business;

    @ManyToOne(() => Account, (account) => account.id, { onDelete: 'CASCADE' })
    account: Account;
}
