import { catchError } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AccountSecurityService {
    constructor(private _httpClient: HttpClient) {

    }

    /**
     * Change the password
     */
    changePassword(credentials: {currentPassword: string, newPassword: string}): Observable<any> {
        return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/changePassword`,credentials).pipe(
            catchError(() => {
                return of(false);
            })
        );
    }

     /**
     * Send token to change email address 
     */
      sendEmailChangeToken(credentials: {email: string}): Observable<any> {
        return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/sendEmailChangeToken`,credentials).pipe(
            catchError(() => {
                return of(false);
            })
        );
    }

    /**
     * Change the email
     */
     changeEmail(credentials: {newEmail: string, token: string}): Observable<any> {
        return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/changeEmailAddress`,credentials).pipe(
            catchError(() => {
                return of(false);
            })
        );
    }


    /**
     * Send token to change phone number
     */
          sendPhoneNumberChangeToken(credentials: {newPhone: string}): Observable<any> {
            return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/sendPhoneNumberChangeToken`,credentials).pipe(
                catchError(() => {
                    return of(false);
                })
            );
        }
    
        /**
         * Change the email
         */
         changePhoneNumber(credentials: {newPhone: string, token: string}): Observable<any> {
            return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/changePhoneNumber`,credentials).pipe(
                catchError(() => {
                    return of(false);
                })
            );
        }

}