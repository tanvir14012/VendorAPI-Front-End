import { UserType } from "../auth/auth-types";

export interface UserProfile 
{
    id?: number | null;
    userId: number;
    firstName: string;
    lastName: string;
    businessOptionId?: number | null;
    jobTitle: string;
    company: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    country?: any | null;
    countryCode: string;
    website: string;
    avatar: any;
    avatarBase64: string;
    userType?: UserType | null;
}