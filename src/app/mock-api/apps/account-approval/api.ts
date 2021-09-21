import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { accountApprovals as accountApprovalData, countries as countriesData, tags as tagsData } from 'app/mock-api/apps/account-approval/data';

@Injectable({
    providedIn: 'root'
})
export class AccountApprovalMockApi
{
    private accountApprovals: any[] = accountApprovalData;
    private _countries: any[] = countriesData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ accountApprovals - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/account-approval/all')
            .reply(() => {

                // Clone the accountApprovals
                const accountApprovals = cloneDeep(this.accountApprovals);

                // Sort the accountApprovals by the name field by default
                accountApprovals.sort((a, b) => a.businessName.localeCompare(b.businessName));

                // Return the response
                return [200, accountApprovals];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ accountApprovals Search - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/account-approval/search')
            .reply(({request}) => {

                // Get the search query
                const query = request.params.get('query');

                // Clone the accountApprovals
                let accountApprovals = cloneDeep(this.accountApprovals);

                // If the query exists...
                if ( query )
                {
                    // Filter the accountApprovals
                    accountApprovals = accountApprovals.filter(accountApproval => accountApproval.name && accountApproval.name.toLowerCase().includes(query.toLowerCase()));
                }

                // Sort the accountApprovals by the name field by default
                accountApprovals.sort((a, b) => a.name.localeCompare(b.name));

                // Return the response
                return [200, accountApprovals];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ accountApproval - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/account-approval/accountApproval')
            .reply(({request}) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the accountApprovals
                const accountApprovals = cloneDeep(this.accountApprovals);

                // Find the accountApproval
                const accountApproval = accountApprovals.find(item => item.id === id);

                // Return the response
                return [200, accountApproval];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ accountApproval - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/apps/account-approval/accountApproval')
            .reply(() => {

                // Generate a new accountApproval
                const newContact = {
                    id          : FuseMockApiUtils.guid(),
                    avatar      : null,
                    name        : 'New accountApproval',
                    emails      : [],
                    phoneNumbers: [],
                    job         : {
                        title  : '',
                        company: ''
                    },
                    birthday    : null,
                    address     : null,
                    notes       : null,
                    tags        : []
                };

                // Unshift the new accountApproval
                this.accountApprovals.unshift(newContact);

                // Return the response
                return [200, newContact];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ accountApproval - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/apps/account-approval/accountApproval')
            .reply(({request}) => {

                // Get the id and accountApproval
                const id = request.body.id;
                const accountApproval = cloneDeep(request.body.accountApproval);

                // Prepare the updated accountApproval
                let updatedContact = null;

                // Find the accountApproval and update it
                this.accountApprovals.forEach((item, index, accountApprovals) => {

                    if ( item.id === id )
                    {
                        // Update the accountApproval
                        accountApprovals[index] = assign({}, accountApprovals[index], accountApproval);

                        // Store the updated accountApproval
                        updatedContact = accountApprovals[index];
                    }
                });

                // Return the response
                return [200, updatedContact];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ accountApproval - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/apps/account-approval/accountApproval')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the accountApproval and delete it
                this.accountApprovals.forEach((item, index) => {

                    if ( item.id === id )
                    {
                        this.accountApprovals.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Countries - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/account-approval/countries')
            .reply(() => [200, cloneDeep(this._countries)]);

    }
}
