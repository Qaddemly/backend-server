import { SkillLevel } from '../../enums/skillLevel';

export interface CreateSkillContentBody {
    name: string;
    information?: string;
    level?: SkillLevel;
    [key: string]: any;
}

export interface UpdateSkillContentBody {
    name?: string;
    information?: string;
    level?: SkillLevel;
    [key: string]: any;
}
