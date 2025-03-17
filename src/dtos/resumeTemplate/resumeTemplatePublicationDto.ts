import { SkillLevel } from '../../enums/skillLevel';

export interface CreatePublicationContentBody {
    title?: string;
    publication_url?: string;
    publisher?: string;
    date: Date;
    description?: string;
    [key: string]: any;
}

export interface UpdatePublicationContentBody {
    title?: string;
    publication_url?: string;
    publisher?: string;
    description?: string;
    date: Date;
    [key: string]: any;
}
