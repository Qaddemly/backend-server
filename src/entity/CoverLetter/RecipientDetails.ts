import { Column } from 'typeorm';

export class RecipientDetails {
    @Column({ nullable: true })
    nameOfRecipient: string;
    @Column({ nullable: true })
    companyName: string;
    @Column({ nullable: true })
    address: string;
}
