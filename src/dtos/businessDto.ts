import { LocationType } from '../enums/locationType';
import { Account } from '../entity/Account';
import { Address } from '../entity/Address';

export interface CreateBusinessDto {
    name: string;
    logo: string;
    CEO: string;
    founder: string;
    founded: Date;
    address: Address;
    location_type: LocationType;
    description: string;
    company_size: number;
    industry: string;
    headquarter: string;
    email?: string;
    phone?: string;
    website?: string;
}

export interface UpdateBusinessDTO {
    name?: string;
    logo?: string;
    CEO?: string;
    founder?: string;
    founded?: Date;
    address?: Address;
    location_type?: LocationType;
    description?: string;
    company_size?: number;
    industry?: string;
    headquarter?: string;
    email?: string;
    phone?: string;
    website?: string;
}
