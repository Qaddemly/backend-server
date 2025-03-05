export interface CreateEducationContentBody {
    school?: string;
    school_link?: string;
    degree?: string;
    city?: string;
    country?: string;
    start_month?: number;
    end_month?: number;
    start_year?: number;
    end_year?: number;

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
    start_month?: number;
    end_month?: number;
    start_year?: number;
    end_year?: number;

    is_current?: boolean;

    description?: string;

    [key: string]: any;
}
