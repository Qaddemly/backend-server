import { SkillLevel } from '../../enums/skillLevel';

export interface CreateAwardContentBody {
    award: string;
    award_url?: string;
    issuer?: string;
    date: Date;
    description?: string;
    [key: string]: any;
}

export interface UpdateAwardContentBody {
    award?: string;
    award_url?: string;
    issuer?: string;
    description?: string;
    date: Date;
    [key: string]: any;
}
