import { Route } from '@angular/router';
import { CanDeactivateAccountApprovalDetails } from 'app/modules/admin/apps/account-approval/account-approval.guards';
import { AccountApprovalDetailsResolver, AccountApprovalCountriesResolver, AccountApprovalResolver } from 'app/modules/admin/apps/account-approval/account-approval.resolvers';
import { AccountApprovalComponent } from 'app/modules/admin/apps/account-approval/account-approval.component';
import { AccountApprovalListComponent } from 'app/modules/admin/apps/account-approval/list/list.component';
import { AccountApprovalDetailsComponent } from 'app/modules/admin/apps/account-approval/details/details.component';

export const accountApprovalRoutes: Route[] = [
    {
        path     : '',
        component: AccountApprovalComponent,
        children : [
            {
                path     : '',
                component: AccountApprovalListComponent,
                resolve  : {
                    tasks    : AccountApprovalResolver,
                    countries: AccountApprovalCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : AccountApprovalDetailsComponent,
                        resolve      : {
                            task     : AccountApprovalDetailsResolver,
                            countries: AccountApprovalCountriesResolver
                        },
                        canDeactivate: [CanDeactivateAccountApprovalDetails]
                    }
                ]
            }
        ]
    }
];
