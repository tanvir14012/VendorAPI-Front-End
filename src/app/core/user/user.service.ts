import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { UserPrivilegeInfo } from 'app/modules/admin/pages/settings/settings.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    private _userPrivilegeInfo: ReplaySubject<UserPrivilegeInfo> = new ReplaySubject<UserPrivilegeInfo>(1);

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
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    get userPrivilegeInfo$(): Observable<UserPrivilegeInfo>
    {
        return this._userPrivilegeInfo.asObservable();
    }
 
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    /**
     * Get the logged-in user privilege info
     */
    getUserPrivilegeInfo(): Observable<UserPrivilegeInfo> {
        return this._httpClient.post<UserPrivilegeInfo>(`${environment.ApiRoot}/account/getUserPrivilegeInfo`, {}).pipe(
            switchMap((privilegeInfo: UserPrivilegeInfo) => {
                this._userPrivilegeInfo.next(privilegeInfo);
                return of(privilegeInfo);
            }),
            catchError(() => {
                return of(null);
            })
        );
    }
}
