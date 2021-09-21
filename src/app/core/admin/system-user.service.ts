import { catchError, switchMap, take } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, of, ReplaySubject } from 'rxjs';
import { SystemUser } from './system-user.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SystemUserService {
    private _systemUsers$: ReplaySubject<SystemUser[]> = new ReplaySubject<SystemUser[]>(1);

    constructor(
        private _httpClient: HttpClient
    ) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for system users
     *
     * @param value
     */
    set systemUsers(value: SystemUser[]) {
        // Store the value
        this._systemUsers$.next(value);
    }

    get systemUsers$(): Observable<SystemUser[]> {
        return this._systemUsers$.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * 
     *  Get all system users
     */
    getUsers(): Observable<SystemUser[]> {
        return this._httpClient.get<SystemUser[]>(`${environment.ApiRoot}/admin/getAllSystemUsers`).pipe(
            switchMap((users: SystemUser[]) => {
                this._systemUsers$.next(users);
                return of(users);
            }),
            catchError(() => {
                return of(null);
            })
        )
    }

    /**
     * Add a system user
     * @param user 
     */
     addSystemUser(user: any): Observable<SystemUser> {

        let formData = new FormData();
        for(let key in user) {
            //No need to upload base64 image format back, sending the file already.
            if(user[key] !== '' && key !== 'avatar' 
                && key !== 'avatarBase64' && key !== 'country' && key !== 'phoneNumber') {
                formData.append(key, user[key]);
            }
        }
        formData.append('countryCode', user.country?.iso);
        formData.append('phone', user.phoneNumber.number);

        //If there is no image in preview, it means avatar is removed by the user,
        // any existing avatar should be deleted from server.
        formData.append('removeAvatar', JSON.stringify(user.avatarBase64 === null));

        //Add the image file
        if(user.avatar) {
            formData.append('avatar', user.avatar.file, user.avatar.name);
        }

        //formData.forEach((val, key) => console.log(`${key}: ${val}`));
        
        const headers = new HttpHeaders().append("Content-Decomposition", "multipart/form-data");

        return this._httpClient.post<SystemUser>(`${environment.ApiRoot}/admin/addSystemUser`, formData,
        {
            headers: headers
        }).pipe(
            switchMap((systemUser: SystemUser) => {
                if(systemUser) {
                    this._systemUsers$.pipe(take(1))
                    .subscribe((users: SystemUser[]) => {
                        users.push(systemUser);
                        this._systemUsers$.next(users);
                    });
                }
    
                return of(systemUser);
            }),
            catchError(() => {
                return of(null);
            })
        );
    }

    /**
     * 
     * @param user Update a system user
     */
    updateSystemUser(user: any): Observable<SystemUser> {

        let formData = new FormData();
        for(let key in user) {
            //No need to upload base64 image format back, sending the file already.
            if(user[key] !== '' && key !== 'avatar' 
                && key !== 'avatarBase64' && key !== 'country' && key !== 'phoneNumber'
                 && key !== 'password') {
                formData.append(key, user[key]);
            }
        }

        formData.append('countryCode', user.country?.iso);
        formData.append('phone', user.phoneNumber.number);

        //password
        formData.append('password', user.password !== '' ? user.password : 'do-not-update');

        //If there is no image in preview, it means avatar is removed by the user,
        // any existing avatar should be deleted from server.
        formData.append('removeAvatar', JSON.stringify(user.avatarBase64 === null));

        //Add the image file
        if(user.avatar) {
            formData.append('avatar', user.avatar.file, user.avatar.name);
        }
        const headers = new HttpHeaders().append("Content-Decomposition", "multipart/form-data");

        return this._httpClient.post<SystemUser>(`${environment.ApiRoot}/admin/updateSystemUser`, formData, {
            headers: headers
        }).pipe(
            switchMap((systemUser: SystemUser) => {
                if(systemUser) {
                    this._systemUsers$.pipe(take(1))
                    .subscribe((users: SystemUser[]) => {
                        let index = users.findIndex(user => user.userId === systemUser.userId);
                        if (index !== -1) {
                            users[index] = systemUser;
                            this._systemUsers$.next(users);
                        }
                    });
                }
        
                return of(systemUser);
            }),
            catchError(() => {
                return of(null);
            })
        );
    }

    /**
     * Update the role
     */
    updateSystemUserRole(user: SystemUser, newRole: any): Observable<any> {

        let formData = new FormData();
        for(let key in user) {
            //No need to upload base64 image format back, sending the file already.
            if(user[key] !== '' && key !== 'avatar' 
                && key !== 'avatarBase64' && key != 'role' && key != 'password') {
                formData.append(key, user[key]);
            }
        }

        //Set role
        formData.append('role', newRole);
        //password
        formData.append('password', user.password !== '' ? user.password : 'do-not-update');

        //Not to remove avatar
        formData.append('removeAvatar', JSON.stringify(false));

        const headers = new HttpHeaders().append("Content-Decomposition", "multipart/form-data");

        return this._httpClient.post<SystemUser>(`${environment.ApiRoot}/admin/updateSystemUser`, formData, {
            headers: headers
        }).pipe(
            switchMap((systemUser: SystemUser) => {
                if(systemUser) {
                    this._systemUsers$.pipe(take(1))
                    .subscribe((users: SystemUser[]) => {
                        let index = users.findIndex(user => user.userId === systemUser.userId);
                        if (index !== -1) {
                            users[index] = systemUser;
                            this._systemUsers$.next(users);
                        }
                    });
                }
                
                return of(systemUser);
            }),
            catchError(() => {
                return of(null);
            })
        );
    }


    /**
     * Remove a system user
     * @param id: the user ID
     */
    removeSystemUser(id: number): Observable<boolean>{
        return this._httpClient.delete(`${environment.ApiRoot}/admin/deleteSystemUser/${id}`).pipe(
            switchMap((removed: boolean) => {
                if(removed) {
                    this._systemUsers$.pipe(take(1))
                    .subscribe((users: SystemUser[]) => {
                        let index = users.findIndex(user => user.userId === id);
                        if (index !== -1) {
                            users.splice(index, 1);
                            this._systemUsers$.next(users);
                        }
                    });
                    return of(true);
                }
                return of(false);
            }),
            catchError(() => {
                return of(false);
            })
        )
    }


}