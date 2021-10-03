
export interface Pagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
}

export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}