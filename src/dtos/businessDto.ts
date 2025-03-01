import { LocationType } from '../enums/locationType';
import { Account } from '../entity/Account/Account';
import { Address } from '../entity/General/Address';
import { Business } from '../entity/Business/Business';
import { BusinessPhone } from '../entity/Business/BusinessPhone';

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
    phones?: BusinessPhone[];
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
    phone?: BusinessPhone;
    website?: string;
}

export interface getBusinessDto {
    id: number;
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
    phone?: BusinessPhone;
    website?: string;
    created_at: Date;
    updated_at: Date;
}

export const getBusinessDto = (business) => {
    const country = business.country || business.address.country;
    const city = business.city || business.address.city;

    // Phone will have it's own API

    return {
        id: business.id,
        name: business.name,
        logo: business.logo,
        CEO: business.CEO,
        founder: business.founder,
        founded: business.founded,
        address: {
            country: country,
            city: city,
        },
        location_type: business.location_type,
        description: business.description,
        company_size: Number(business.company_size),
        industry: business.industry,
        headquarter: business.headquarter,
        email: business.email,
        website: business.website,
        created_at: business.created_at,
        updated_at: business.updated_at,
    };
};
