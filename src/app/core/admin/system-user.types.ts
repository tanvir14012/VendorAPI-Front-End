export interface SystemUser 
{
    userId?: number | null;
    profileId?: number| null;
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    phone: string;
    password: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    country?: any | null;
    countryCode: string;
    role: Role;
    accountStatus: SystemUserAccountStatus,
    avatar: any;
    avatarBase64: string;
}

export enum Role 
{
    SystemAdmin,
    SystemUser
}

export enum SystemUserAccountStatus 
{
    Active = 0,
    Disabled = 2
}