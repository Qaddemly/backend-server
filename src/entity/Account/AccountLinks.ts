import { Column } from 'typeorm';

export class AccountLinks {
    @Column({ type: 'text', nullable: true })
    linkedin: string;

    @Column({ type: 'text', nullable: true })
    github: string;

    @Column({ type: 'text', nullable: true })
    portfolio: string;

    @Column({ type: 'text', nullable: true })
    twitter: string;

    @Column({ type: 'text', nullable: true })
    facebook: string;

    @Column({ type: 'text', nullable: true })
    instagram: string;

    @Column({ type: 'text', nullable: true })
    youtube: string;

    @Column({ type: 'text', nullable: true })
    website: string;
}
