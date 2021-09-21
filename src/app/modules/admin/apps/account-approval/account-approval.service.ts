import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { AccountApproval, Country, Pagination } from 'app/modules/admin/apps/account-approval/account-approval.types';

@Injectable({
    providedIn: 'root'
})
export class AccountApprovalService
{
    // Private
    private _accountApproval: BehaviorSubject<AccountApproval | null> = new BehaviorSubject(null);
    private _accountApprovals: BehaviorSubject<AccountApproval[] | null> = new BehaviorSubject(null);
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
     * Getter for AccountApproval
     */
    get AccountApproval$(): Observable<AccountApproval>
    {
        return this._accountApproval.asObservable();
    }

    /**
     * Getter for account-approval
     */
    get accountApproval$(): Observable<AccountApproval[]>
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
    getAccountApprovals(): Observable<AccountApproval[]>
    {
        return this._httpClient.get<AccountApproval[]>('api/apps/account-approval/all').pipe(
            tap((accountApproval) => {
                accountApproval = accountApproval.sort((a, b) => {
                    return a.businessName.localeCompare(b.businessName);
                });
                this._accountApprovals.next(accountApproval);
                this._pagination.next({
                    length: accountApproval.length,
                    size: 5,
                    page: 0,
                    lastPage: Math.ceil(accountApproval.length/5),
                    startIndex: 0,
                    endIndex: accountApproval.length - 1
                 } as Pagination);
            })
        );
    }

    /**
     * Search account-approval with given query
     *
     * @param query
     */
    searchAccountApprovals(query: string): Observable<AccountApproval[]>
    {
        return this._httpClient.get<AccountApproval[]>('api/apps/account-approval/search', {
            params: {query}
        }).pipe(
            tap((accountApproval) => {
                this._accountApprovals.next(accountApproval);
            })
        );
    }

    /**
     * Get AccountApproval by id
     */
    getAccountApprovalById(id: string): Observable<AccountApproval>
    {
        return this._accountApprovals.pipe(
            take(1),
            map((accountApproval) => {

                // Find the AccountApproval
                const AccountApproval = accountApproval.find(item => item.id === id) || null;

                // Update the AccountApproval
                this._accountApproval.next(AccountApproval);

                // Return the AccountApproval
                return AccountApproval;
            }),
            switchMap((AccountApproval) => {

                if ( !AccountApproval )
                {
                    return throwError('Could not found AccountApproval with id of ' + id + '!');
                }

                return of(AccountApproval);
            })
        );
    }

    /**
     * Create AccountApproval
     */
    createAccountApproval(): Observable<AccountApproval>
    {
        return this.accountApproval$.pipe(
            take(1),
            switchMap(accountApproval => this._httpClient.post<AccountApproval>('api/apps/account-approval/AccountApproval', {}).pipe(
                map((newContact) => {

                    // Update the account-approval with the new AccountApproval
                    this._accountApprovals.next([newContact, ...accountApproval]);

                    // Return the new AccountApproval
                    return newContact;
                })
            ))
        );
    }

    /**
     * Update AccountApproval
     *
     * @param id
     * @param AccountApproval
     */
    updateAccountApproval(id: string, AccountApproval: AccountApproval): Observable<AccountApproval>
    {
        return this.accountApproval$.pipe(
            take(1),
            switchMap(accountApproval => this._httpClient.patch<AccountApproval>('api/apps/account-approval/AccountApproval', {
                id,
                AccountApproval
            }).pipe(
                map((updatedContact) => {

                    // Find the index of the updated AccountApproval
                    const index = accountApproval.findIndex(item => item.id === id);

                    // Update the AccountApproval
                    accountApproval[index] = updatedContact;

                    // Update the account-approval
                    this._accountApprovals.next(accountApproval);

                    // Return the updated AccountApproval
                    return updatedContact;
                }),
                switchMap(updatedContact => this.AccountApproval$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the AccountApproval if it's selected
                        this._accountApproval.next(updatedContact);

                        // Return the updated AccountApproval
                        return updatedContact;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the AccountApproval
     *
     * @param id
     */
    deleteAccountApproval(id: string): Observable<boolean>
    {
        return this.accountApproval$.pipe(
            take(1),
            switchMap(accountApproval => this._httpClient.delete('api/apps/account-approval/AccountApproval', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted AccountApproval
                    const index = accountApproval.findIndex(item => item.id === id);

                    // Delete the AccountApproval
                    accountApproval.splice(index, 1);

                    // Update the account-approval
                    this._accountApprovals.next(accountApproval);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
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
