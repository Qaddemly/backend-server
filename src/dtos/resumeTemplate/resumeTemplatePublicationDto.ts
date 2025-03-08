import { SkillLevel } from '../../enums/skillLevel';

export interface CreatePublicationContentBody {
    title?: string;
    publication_url?: string;
    publisher?: string;
    date: { day?: number; month?: number; year?: number };
    description?: string;
    [key: string]: any;
}

export interface UpdatePublicationContentBody {
    title?: string;
    publication_url?: string;
    publisher?: string;
    description?: string;
    date: { day?: number; month?: number; year?: number };
    [key: string]: any;
}
