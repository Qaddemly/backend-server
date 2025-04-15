export interface CreateCoverLetterDto {
    name?: string;
}

export interface UpdateCoverLetterInfoDto {
    body?: string;
    name?: string;
    date?: Date;
    recipientDetails?: {
        nameOfRecipient?: string;
        companyName?: string;
        address?: string;
    };
}
