export interface AccountApproval
{
    id: string;
    firstName: string;
    lastName: string;
    businessName: string;
    idDocType: string;
    idDocPicture: string;
    idNumber: string;
    address1: string;
    address2: string;
    city: string;
    country: string;
    zip: string;
    phoneNumber: {
        countryCode: string,
        number: string
    };
    email: string;
    website: string;
    documentAttachments: any[];
    status: string;
    readStatus: string;
    createdDate: Date;
    lastUpdatedDate: Date;
}

export interface Pagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}

export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}