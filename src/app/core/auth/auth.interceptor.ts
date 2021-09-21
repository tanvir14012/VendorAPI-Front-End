import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError, ReplaySubject, of,EMPTY } from 'rxjs';
import { catchError, delay, finalize, retryWhen, scan, switchMap } from 'rxjs/operators';
import { AuthService } from 'app/core/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private aRefreshInProgress: boolean = false;
    private refreshResult$: ReplaySubject<any> = new ReplaySubject<any>(1);

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService) {
    }

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            withCredentials: true // For development purpose only, enables cross-site cookie/tls etc.
        });

        const accessToken = this._authService.accessToken;
        if (accessToken !== '') {
            req = this.setBearerToken(req, accessToken);
        }
        // Response
        return next.handle(req).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse) {
                    switch (error.status) {
                        case 401: return this.handleUnauthorizedError(req, next);
                        default: return throwError(error);
                    }
                }
            })
        );
    }

    /**
     * Sets the Authorization header with bearer token (access token) to a HttpRequest.
     * @param req: A HttpRequest
     * @returns  A HttpRequest with Authorization header containing bearer token
     */
    private setBearerToken(req: HttpRequest<any>, accessToken: string): HttpRequest<any> {

        return req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + accessToken)
        });
    }

    private handleUnauthorizedError(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        //Block all requests while a refresh is in progress.
        if (!this.aRefreshInProgress) {
            this.aRefreshInProgress = true;

            //Retry failed requests three times in 1s interval. If all fails, delete the access token to sign the user out.
            return this._authService.refreshUserTokens().pipe(
                switchMap((refreshResult: any) => {
                    this.refreshResult$.next(refreshResult);
                    if(refreshResult.refreshSucceeded) {
                        return next.handle(this.setBearerToken(req, refreshResult.accessToken));
                    }
                    else {
                        return next.handle(req);
                    }
                }),

                finalize(() => {
                    this.aRefreshInProgress = false;
                })
            )

        }
        //Handle 401 errored requests queued when a refresh is in progress. In this case, wait until
        // the refresh request gets a response.
        else {
            return this.refreshResult$.pipe(
                switchMap((refreshResult: any) => {
                    if(refreshResult.refreshSucceeded) {
                        return next.handle(this.setBearerToken(req, refreshResult.accessToken));
                    }
                    else {
                        return next.handle(req);
                    }
                })
            );
        }
    }

}
