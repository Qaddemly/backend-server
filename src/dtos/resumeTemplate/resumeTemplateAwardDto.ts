import { SkillLevel } from '../../enums/skillLevel';

export interface CreateAwardContentBody {
    award: string;
    award_url?: string;
    issuer?: string;
    date: { day?: number; month?: number; year?: number };
    description?: string;
    [key: string]: any;
}

export interface UpdateAwardContentBody {
    award?: string;
    award_url?: string;
    issuer?: string;
    description?: string;
    date: { day?: number; month?: number; year?: number };
    [key: string]: any;
}
