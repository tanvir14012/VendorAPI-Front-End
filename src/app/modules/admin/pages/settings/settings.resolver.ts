import { SystemUserService } from './../../../../core/admin/system-user.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'app/core/user/user.service';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { UserProfileService } from 'app/core/user-profile/user-profile.service';
import { delay, take, retryWhen, tap, switchMap, catchError, scan } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export default class SettingsDataResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _userProfileService: UserProfileService,
        private _userService: UserService,
        private _httpClient: HttpClient,
        private _systemUserService: SystemUserService) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._httpClient.get(`${environment.ApiRoot}/account/checkAccessTokenValidity`).pipe(
            //Retry failed request twice
            retryWhen((error: Observable<any>) => {
                return error.pipe(
                    scan((count: number) => {
                        count++;
                        if (count < 2) {
                            return count;
                        }
                        else {
                            throw error;
                        }
                    }, 0),
                    delay(1000)
                )
            }),

            switchMap(() => {
                return forkJoin({
                    profile: this._userProfileService.get(),
                    userPrivilegeInfo: this._userService.getUserPrivilegeInfo()
                });
            })
        )
    }
    
}
