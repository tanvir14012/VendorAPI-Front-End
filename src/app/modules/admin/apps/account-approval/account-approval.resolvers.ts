import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountApprovalService } from 'app/core/account-approval/account-approval.service';
import { Country } from 'app/core/account-approval/account-approval.types';

@Injectable({
    providedIn: 'root'
})
export class AccountApprovalResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _accountApprovalsService: AccountApprovalService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]>
    {
        let model:any =  localStorage.getItem('accountApprovalFilter');
        if(model) {
            model = JSON.parse(model);
        }
        else {
            model = {
                approverId: 0,
                startDate:  null,
                endDate: null,
                pageNo: 0,
                enteryPerPage: 5,
                filters: [0]
            };
        }

        return this._accountApprovalsService.getAccountApprovals(model);
    }
}

@Injectable({
    providedIn: 'root'
})
export class AccountApprovalDetailsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _accountApprovalsService: AccountApprovalService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._accountApprovalsService.getAccountApprovalById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested AccountApproval is not available
                       catchError((error) => {

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

@Injectable({
    providedIn: 'root'
})
export class AccountApprovalCountriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _accountApprovalsService: AccountApprovalService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Country[]>
    {
        return this._accountApprovalsService.getCountries();
    }
}
