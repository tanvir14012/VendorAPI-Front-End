import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountApprovalDetailsComponent } from 'app/modules/admin/apps/account-approval/details/details.component';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateAccountApprovalDetails implements CanDeactivate<AccountApprovalDetailsComponent>
{
    canDeactivate(
        component: AccountApprovalDetailsComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        // Get the next route
        let nextRoute: ActivatedRouteSnapshot = nextState.root;
        while ( nextRoute.firstChild )
        {
            nextRoute = nextRoute.firstChild;
        }

        // If the next state doesn't contain '/approve-accounts'
        // it means we are navigating away from the
        // account-approval app
        if ( !nextState.url.includes('/approve-accounts') )
        {
            // Let it navigate
            return true;
        }

        // If we are navigating to another AccountApproval...
        if ( nextRoute.paramMap.get('id') )
        {
            // Just navigate
            return true;
        }
        // Otherwise...
        else
        {
            // Close the drawer first, and then navigate
            return component.closeDrawer().then(() => true);
        }
    }
}
