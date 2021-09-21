import { AccountStatus, AuthStatus, SignInStatus } from './../auth-types';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad
{
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
    {
        return this._check(route, state);
    }

    /**
     * Can activate child
     *
     * @param childRoute
     * @param state
     */
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        return this._check(childRoute, state);
    }

    /**
     * Can load
     *
     * @param route
     * @param segments
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean
    {
        // Check the authentication status
        return this._authService.checkAuthStatus()
                   .pipe(
                       switchMap((authStatus: AuthStatus) => {
                           switch(authStatus.signInStatus ) {
                                case SignInStatus.Authenticated:
                                    return of(true);
                                case SignInStatus.Unauthenticated: 
                                    this._router.navigate(['sign-in']);
                                    return of(false);
                                case SignInStatus.SessionLocked: 
                                    this._router.navigate(['unlock-session']);
                                    return of(false);
                                case SignInStatus.RequiresTwoFactor: 
                                    this._router.navigate(['sign-in']);
                                    return of(false);                                                                 
                           }
                       })
                   );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
    private _check(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    {
        // Check the authentication status
        return this._authService.checkAuthStatus()
                   .pipe(
                       switchMap((authStatus: AuthStatus) => {
                           switch(authStatus.signInStatus ) {
                                case SignInStatus.Authenticated:

                                    //If the account setup is not completed, only navigate to /account-setup or /sign-out
                                    if(authStatus.accountStatus == AccountStatus.PendingManualVerification
                                        || authStatus.accountStatus == AccountStatus.VerificationFailed) {
                                            if(state.url !== '/account-setup' && state.url !== '/sign-out') {
                                                this._router.navigate(['account-setup']);
                                                return of(false);
                                            }
                                        }

                                    return of(true);
                                case SignInStatus.Unauthenticated: 
                                    this._router.navigate(['sign-in']);
                                    return of(false);
                                case SignInStatus.SessionLocked: 
                                    if(state.url.includes('/unlock-session') || state.url === '/sign-out') {
                                        return of(true);
                                    }
                                    this._router.navigate(['unlock-session']);
                                    return of(false);
                                case SignInStatus.RequiresTwoFactor: 
                                    this._router.navigate(['sign-in']);
                                    return of(false);                                                                 
                           }
                       })
                   );
    }
}
