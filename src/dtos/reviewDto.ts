import exp from 'node:constants';

export interface CreateReviewBodyDTO {
    business_id: number;
    description: string;
    rating: number;
}
export interface CreateReviewDTO {
    description: string;
    rating: number;
    business_id: number;
    account_id: number;
}
