import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { AuthUtils } from './auth.utils';
import { AccountStatus, AuthStatus, SignInStatus } from './auth-types';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { catchError, delay, finalize, retryWhen, scan, switchMap, tap } from 'rxjs/operators';
import { UserService } from 'app/core/user/user.service';

@Injectable()
export class AuthService {
    private _authStatus$: ReplaySubject<AuthStatus> = new ReplaySubject<AuthStatus>(1);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _router: Router
    ) {
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    get authStatus(): Observable<AuthStatus> {
        return this._authStatus$ as Observable<AuthStatus>;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(model: {email: string}): Observable<any> {
        const headers = new HttpHeaders().append('Content-Type', 'application/json');
        return this._httpClient.post<any>(`${environment.ApiRoot}/account/sendPasswordResetEmail`, JSON.stringify(model.email), {
            headers: headers
        });
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(model: {email: string, token: string, password: string}): Observable<any> {
        return this._httpClient.post<any>(`${environment.ApiRoot}/account/resetPassowrd`, model);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string, rememberMe: boolean }): Observable<any> {

        return this._httpClient.post(`${environment.ApiRoot}/account/signin`, credentials).pipe(
            switchMap((signinResult: any) => {

                if(signinResult.succeeded) {
                    this.accessToken = signinResult.accessToken;
                    const authStatus = this.populateAuthStatus(signinResult.accessToken);
                    if(authStatus) {
                        this._authStatus$.next(authStatus);
                    }
                }
                // Return a new observable with the response
                return of(signinResult);
            })
        );
    }

    /**
     * Get an access token from the refresh token, rotate the refresh token.
     */
    refreshUserTokens(): Observable<any> {
        const httpOptions: any = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            }),
            observe: "response"
        };

        // Renew access token
        return this._httpClient.post(`${environment.ApiRoot}/account/refreshUserTokens`, {}, httpOptions)
            .pipe(
                //Retry failed requests 2 times
                retryWhen((error: Observable<any>) => {
                    return error.pipe(
                        scan((count: number) => {
                            count++;
                            if (count < 3) {
                                return count;
                            }
                            else {
                                throw error;
                            }
                        }, 0),
                        delay(1000)
                    )
                }),
                catchError(() => {
                    localStorage.removeItem('accessToken');
                    // Navigate to root route
                    this._router.navigate(['']);
                    location.reload();
                    return of({
                        refreshSucceeded: false
                    });
                }),
                switchMap((response: any) => {
                    const refreshResult = response.body;

                    if (refreshResult.refreshSucceeded) {
                        this.accessToken = refreshResult.accessToken;
                        
                        //Refresh the auth status
                        const authStatus = this.populateAuthStatus(refreshResult.accessToken);
                        if(authStatus) {
                            this._authStatus$.next(authStatus);
                        }

                        //Navigate to unlock-session page if session is locked
                        if(refreshResult.isSessionLocked) {
                            this._router.navigate(['unlock-session'], { queryParams: { redirectURL: this._router.url}});
                        }
                    }
                    else if (refreshResult.signedOut) {
                        // Remove the access token from the local storage
                        localStorage.removeItem('accessToken');
                        // Navigate to root route
                        this._router.navigate(['']);
                        location.reload();
                    }
                    return of(refreshResult);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<boolean> {

        const httpOptions: any = {
            headers: new HttpHeaders({
                "Content-Type": "application/json"
            }),
            observe: "response"
        };

        return this._httpClient.post(`${environment.ApiRoot}/account/signout`,
            {}, httpOptions).pipe(
                switchMap(() => {
                    return of(true)
                }),
                catchError((err) => {
                    //HTTP 401 occurs when access token get expired and remember me is false.
                    return of(err.status === 401);
                }),
                finalize(() => {
                    // Remove the access token from the local storage
                    localStorage.removeItem('accessToken');
                })
            );

    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        firstName: string; lastName: string, email: string; phoneNumber: any,
        password: string, company: string, businessModel: string, aggrements: boolean
    }): Observable<any> {
        return this._httpClient.post(`${environment.ApiRoot}/account/signup`, user);
    }

    /**
     * Lock session
     */

    lockSession(): Observable<any> {
        return this._httpClient.post<any>(`${environment.ApiRoot}/account/lockSession`, {}).pipe(
            switchMap((result: any) => {
                if(result.isSessionLocked) {
                    this.accessToken = result.accessToken;
                    this.checkAuthStatus();
                    this._router.navigate(['unlock-session'], { queryParams: { redirectURL: this._router.url}});
                }
                else if(result.isSignedOut) {
                    // Remove the access token from the local storage
                    localStorage.removeItem('accessToken');
                    // Navigate to root route
                    this._router.navigate(['']);
                    location.reload();
                }

                return of(result);
            }),
            catchError(() => {
                return of(null);
            })
        )
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(password: { value: string}): Observable<any> {
        return this._httpClient.post(`${environment.ApiRoot}/account/unlockSession`, password).pipe(
            switchMap((result: any) => {
                if(result.unlockSuccess) {
                    this.accessToken = result.accessToken;
                    this.checkAuthStatus();
                }

                return of(result);
            }),
            catchError(() => {
                return of({
                    unlockSuccess: false,
                    errorMessage: "Something went wrong! Please try later."
                });
            })
        );
    }

    /**
     * Confirm verification email
     */
    confirmEmail(model: { email: string, token: string}): Observable<boolean> {
        return this._httpClient.post<boolean>(`${environment.ApiRoot}/account/confirmEmailAddress`, model).pipe(
            catchError(() => {
                return of(false);
            })
        );
    }

    /**
     * Resend email verification
     */
     resendEmailVerification(model: { email: string}): Observable<any> {
        const headers = new HttpHeaders().append('Content-Type', 'application/json');
        return this._httpClient.post<any>(`${environment.ApiRoot}/account/resendEmailVerification`, JSON.stringify(model.email), {
            headers: headers
        });
    }

    /**
     * Check the authentication status
     */
    checkAuthStatus(): Observable<AuthStatus> {

        // Check the access token availability
        if (!this.accessToken) {

            //Check 2FA status
            const twoFA = localStorage.getItem('twoFA');
            if(twoFA) {
                const tokenObj = JSON.parse(twoFA);
                if(tokenObj.token && tokenObj.expiry) {
                    //If 2fa token expired
                    if(new Date().getTime() > tokenObj.expiry) {
                        localStorage.removeItem('twoFA');
                    }

                    else {
                        this._authStatus$.next({
                            signInStatus: SignInStatus.RequiresTwoFactor
                        });
                    }
                }
            }

            this._authStatus$.next({
                signInStatus: SignInStatus.Unauthenticated
            });
            return this._authStatus$;
        }
        else {
            const authStatus = this.populateAuthStatus(this.accessToken);
            if (authStatus) {
                this._authStatus$.next(authStatus);
                return this._authStatus$;
            }
            else {
                // Remove the access token from the local storage
                localStorage.removeItem('accessToken');

                this._authStatus$.next({
                    signInStatus: SignInStatus.Unauthenticated
                });
                return this._authStatus$;
            }

        }
    }

    /**
     * Populates the authentication status and account info from the access token.
     * @param accessToken 
     * @returns 
     */
    private populateAuthStatus(accessToken: string): AuthStatus {
        try {
            const accessTokenPayload = AuthUtils.decodeToken(accessToken);
            let authStatus: AuthStatus = {
                signInStatus: accessTokenPayload.isSessionLocked === "true" ? 
                    SignInStatus.SessionLocked: SignInStatus.Authenticated,
                userId: accessTokenPayload.nameid,
                userEmail: accessTokenPayload.email,
                userPhone: accessTokenPayload.phoneNumber,
                claims: accessTokenPayload.claims,
                roles: accessTokenPayload.role,
                rememberMe: accessTokenPayload.isPersistent === "true",
                userType: parseInt(accessTokenPayload.usertype),
                sessionLockEnabled: accessTokenPayload.sessionLockEnabled === "true",
                TwoFactor: {
                    enabled: accessTokenPayload.twoFactor?.split(":")[0] === 'true',
                    option: accessTokenPayload.twoFactor?.split(":")[1],
                },
                accountStatus: parseInt(accessTokenPayload.accountStatus),
                isSessionLocked: accessTokenPayload.isSessionLocked === "true"
            };

            return authStatus;
        }
        catch (err) {
            return null;
        }

    }
}
