export interface CreateEducationContentBody {
    school?: string;
    school_link?: string;
    degree?: string;
    city?: string;
    country?: string;
    start_date?: Date;
    end_date?: Date;

    is_current?: boolean;

    description?: string;

    [key: string]: any;
}

export interface UpdateEducationContentBody {
    school?: string;
    school_link?: string;
    degree?: string;
    city?: string;
    country?: string;
    start_date?: Date;
    end_date?: Date;

    is_current?: boolean;

    description?: string;

    [key: string]: any;
}
