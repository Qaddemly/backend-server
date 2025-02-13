export interface createCertificateDto {
    title: string;
    issuing_organization: string;
    start_date: Date;
    end_date: Date;
    media: string;
}

export interface updateCertificateDto {
    title?: string;
    issuing_organization?: string;
    start_date?: Date;
    end_date?: Date;
    media?: string;
}
