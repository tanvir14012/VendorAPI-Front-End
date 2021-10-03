import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Country, Pagination } from 'app/core/account-approval/account-approval.types';

@Injectable({
    providedIn: 'root'
})
export class AccountApprovalService
{
    // Private
    private _accountApproval: BehaviorSubject<any> = new BehaviorSubject(null);
    private _accountApprovals: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for selected accountApproval
     */
    get selectedAccountApproval$(): Observable<any>
    {
        return this._accountApproval.asObservable();
    }

    /**
     * Getter for account-approval
     */
    get accountApprovals$(): Observable<any[]>
    {
        return this._accountApprovals.asObservable();
    }

    /**
     * Getter for countries
     */
    get countries$(): Observable<Country[]>
    {
        return this._countries.asObservable();
    }

    /**
     * Getter for pagination
     */
     get pagination$(): Observable<Pagination>
     {
         return this._pagination.asObservable();
     }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get account-approval
     */
    getAccountApprovals(filterModel: any): Observable<any[]>
    {
        return this._httpClient.post<any>(`${environment.ApiRoot}/accountVerification/getVerificationRequests`, filterModel).pipe(
            tap((accountApprovals) => {
                this._accountApprovals.next(accountApprovals);
                this._pagination.next({
                    length: accountApprovals.count,
                    size: filterModel.enteryPerPage,
                    page: filterModel.pageNo,
                    lastPage: Math.ceil(accountApprovals.count/filterModel.enteryPerPage),
                    startIndex: filterModel.pageNo * filterModel.enteryPerPage
                 } as Pagination);
            })
        );
    }


    /**
     * Get AccountApproval by id
     */
    getAccountApprovalById(id: string): Observable<any>
    {
        return this._httpClient.get<any>(`${environment.ApiRoot}/accountVerification/getVerificationRequestDetails/${id}`).pipe(
            tap((accountApproval) => {
                // Update the AccountApproval
                this._accountApproval.next(accountApproval);
            })
        );
    }

    /**
     * Get file for preview
     */

    getFileForPreview(path: string): Observable<any> {
        return this._httpClient.post<any>(`${environment.ApiRoot}/accountVerification/getFile`, { path: path }).pipe(
            catchError((err) => {
                console.log(err);
                return of(err.error?.text);
            })
        );
    }

    /**
     * Download file
     */
     downloadFile(path: string): Observable<any> {
        return this._httpClient.post(`${environment.ApiRoot}/accountVerification/downloadFile`, { path: path }, {
            observe: 'response',
            responseType: 'blob'
        });
    }        

    /**
     * Mark a request as read/unread
     */
    markReadStatus(model: any): Observable<any> {
        return this._httpClient.post(`${environment.ApiRoot}/accountVerification/markReadStatus`, model);
    } 

    /**
     * 
     * Approve or reject a request
     */
    makeVerdict(model: any): Observable<any> {
        return this._httpClient.post(`${environment.ApiRoot}/accountVerification/makeVerdict`, model);
    }

    /**
     * Get countries
     */
    getCountries(): Observable<Country[]>
    {
        return this._httpClient.get<Country[]>('api/apps/account-approval/countries').pipe(
            tap((countries) => {
                this._countries.next(countries);
            })
        );
    }
}
