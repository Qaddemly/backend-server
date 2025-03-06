export interface CreateProjectContentBody {
    title: string;
    project_link?: string;
    subtitle?: string;

    start_month?: number;
    end_month?: number;
    start_year?: number;
    end_year?: number;

    is_current?: boolean;

    description?: string;

    [key: string]: any;
}

export interface UpdateProjectContentBody {
    title?: string;
    project_link?: string;
    subtitle?: string;

    start_month?: number;
    end_month?: number;
    start_year?: number;
    end_year?: number;

    is_current?: boolean;

    description?: string;

    [key: string]: any;
}
