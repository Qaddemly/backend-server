export interface CreatePersonalInfoContentBody {
    full_name?: string;
    job_title?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    picture?: string;
    personal_information?: { [key: string]: any };
    links?: { [key: string]: any };
    [key: string]: any;
}

export interface UpdatePersonalInfoContentBody {
    full_name?: string;
    job_title?: string;
    email?: string;
    phone_number?: string;
    address?: string;
    picture?: string;
    personal_information?: { [key: string]: any };
    links?: { [key: string]: any };
    [key: string]: any;
}
