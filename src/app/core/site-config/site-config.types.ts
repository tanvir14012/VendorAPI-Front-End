export interface SmtpConfig 
{
    id: number;
    server: string;
    username: string;
    password: string;
    fromName: string;
    fromAddress: string;
    port: number;
    useAuthentication?: boolean | null;
    useSecureConnection?: boolean | null;
}

export interface SmsConfig 
{
    id: number;
    originator: string;
    apiAccessKey: string;
    apiSigningKey: string;
}

export interface CompanyInfo 
{
    id: number;
    name: string;
    addressLine1: string;
    addressLine2: string;
    email: string;
    email2: string;
    phoneNumber: string;
    phoneNumber2: string;
    logoImage: any;
    logoImageBase64: string;
}