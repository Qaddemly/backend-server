import { SkillLevel } from '../../enums/skillLevel';

export interface CreateCertificateContentBody {
    certificate: string;
    certificate_url?: string;
    additional_information?: string;
    [key: string]: any;
}

export interface UpdateCertificateContentBody {
    certificate?: string;
    certificate_url?: string;
    additional_information?: string;
    [key: string]: any;
}
