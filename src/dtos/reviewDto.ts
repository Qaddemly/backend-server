import { Business } from '../entity/Business';
import { Account } from '../entity/Account';

interface getReviewDTO {
    id: string;
    description: string;
    rating: number;
    business: Business;
    account: Account;
}
