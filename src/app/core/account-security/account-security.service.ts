import { catchError, switchMap } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, of, ReplaySubject } from "rxjs";
import { TwoFAStatus, TwoFAUpdate, UpdateTwoFAResult, VerifyAuthenticator } from './account-security.types';
import { hsl } from 'chroma-js';


@Injectable({
    providedIn: 'root'
})
export class AccountSecurityService {
    private _twoFAStatus$: ReplaySubject<TwoFAStatus> = new ReplaySubject<TwoFAStatus>(1);
    constructor(private _httpClient: HttpClient) {

    }

    /**
     * Change the password
     */
    changePassword(credentials: { currentPassword: string, newPassword: string }): Observable<any> {
        return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/changePassword`, credentials).pipe(
            catchError(() => {
                return of(false);
            })
        );
    }

    /**
    * Send token to change email address 
    */
    sendEmailChangeToken(credentials: { email: string }): Observable<any> {
        return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/sendEmailChangeToken`, credentials).pipe(
            catchError(() => {
                return of(false);
            })
        );
    }

    /**
     * Change the email
     */
    changeEmail(credentials: { newEmail: string, token: string }): Observable<any> {
        return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/changeEmailAddress`, credentials).pipe(
            catchError(() => {
                return of(false);
            })
        );
    }


    /**
     * Send token to change phone number
     */
    sendPhoneNumberChangeToken(credentials: { newPhone: string }): Observable<any> {
        return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/sendPhoneNumberChangeToken`, credentials).pipe(
            catchError(() => {
                return of(false);
            })
        );
    }

    /**
     * Change the email
     */
    changePhoneNumber(credentials: { newPhone: string, token: string }): Observable<any> {
        return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/changePhoneNumber`, credentials).pipe(
            catchError(() => {
                return of(false);
            })
        );
    }

    /**
     * Getter for two FA status
     */
    get twoFAStatus$() {
        return this._twoFAStatus$.asObservable();
    }

    /**
     * Get Two factor auth status
     */
    getTwoFAStatus(): Observable<TwoFAStatus> {
        return this._httpClient.get<TwoFAStatus>(`${environment.ApiRoot}/account/getTwoFAStatus`).pipe(
            switchMap((status: TwoFAStatus) => {
                this._twoFAStatus$.next(status);
                return of(status);
            }),
            catchError(() => {
                return of(null);
            })
        );
    }

    /**
     * Update 2FA settings
     */
    updateTwoFA(model: TwoFAUpdate): Observable<UpdateTwoFAResult> {
        return this._httpClient.post<UpdateTwoFAResult>(`${environment.ApiRoot}/account/updateTwoFactor`, model);
    }

    /**
     * Verify the authenticator app
     */
    verifyAuthenticator(credentials: VerifyAuthenticator): Observable<any> {
        return this._httpClient.post(`${environment.ApiRoot}/account/verifyAuthenticator`, credentials).pipe(
            catchError(() => {
                return of(null);
            })
        );
    }


    /**
     * Update session lock enable/disable setting
     */
    updateSessionLock(model: any): Observable<any> {
        return this._httpClient.post(`${environment.ApiRoot}/account/updateSessionLockSetting`, model);
    }

}