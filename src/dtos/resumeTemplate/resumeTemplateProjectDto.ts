export interface CreateProjectContentBody {
    title: string;
    project_link?: string;
    subtitle?: string;

    start_date?: Date;
    end_date?: Date;

    is_current?: boolean;

    description?: string;

    [key: string]: any;
}

export interface UpdateProjectContentBody {
    title?: string;
    project_link?: string;
    subtitle?: string;

    start_date?: Date;
    end_date?: Date;

    is_current?: boolean;

    description?: string;

    [key: string]: any;
}
