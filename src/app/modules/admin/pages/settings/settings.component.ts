import { ActivatedRoute } from '@angular/router';
import { UserPrivilegeInfo } from './settings.types';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AccountStatus, UserType } from 'app/core/auth/auth-types';

@Component({
    selector       : 'settings',
    templateUrl    : './settings.component.html',
    encapsulation  : ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, OnDestroy
{
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'account';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userPrivilegeInfo: UserPrivilegeInfo = null;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _activatedRoute: ActivatedRoute
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Setup available panels
        this.panels = [
            {
                id         : 'account',
                icon       : 'heroicons_outline:user-circle',
                title      : 'Account',
                description: 'Manage your public profile and private information'
            },
            {
                id         : 'security',
                icon       : 'heroicons_outline:lock-closed',
                title      : 'Security',
                description: 'Manage your password and 2-step verification preferences'
            },
            {
                id         : 'plan-billing',
                icon       : 'heroicons_outline:credit-card',
                title      : 'Plan & Billing',
                description: 'Manage your subscription plan, payment method and billing information'
            },
            {
                id         : 'notifications',
                icon       : 'heroicons_outline:bell',
                title      : 'Notifications',
                description: 'Manage when you\'ll be notified on which channels'
            },
            {
                id         : 'team',
                icon       : 'heroicons_outline:user-group',
                title      : 'Team',
                description: 'Manage the existing team of system users and change roles/permissions'
            },
            {
                id         : 'site-configuration',
                icon       : 'heroicons_outline:adjustments',
                title      : 'Site Configuration',
                description: 'Adjust the website configuration'
            }
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


           //Get user privilege info 
           this.userPrivilegeInfo = this._activatedRoute.snapshot.data['accountSettings'].userPrivilegeInfo;
           if(this.userPrivilegeInfo) {
               //Check if the user is system admin
               if(this.userPrivilegeInfo.accountStatus === AccountStatus.Active &&
                    this.userPrivilegeInfo.userType === UserType.SystemAdmin) {
                            this.panels.splice(2, 1);
                    }
                    //Check if the user is system user
                    else if(this.userPrivilegeInfo.accountStatus === AccountStatus.Active &&
                            this.userPrivilegeInfo.userType === UserType.SystemUser) {
                            this.panels.splice(2, 1);
                            this.panels.splice(3, 2);
                    }
                    //Check if the user is customer 
                    else if((this.userPrivilegeInfo.accountStatus === AccountStatus.Active || 
                        this.userPrivilegeInfo.accountStatus === AccountStatus.Limited) && 
                        (this.userPrivilegeInfo.userType === UserType.Customer)) {
                            this.panels.splice(4, 2);
                    }
                    //Check if the user is customer client
                    else if((this.userPrivilegeInfo.accountStatus === AccountStatus.Active || 
                        this.userPrivilegeInfo.accountStatus === AccountStatus.Limited) && 
                        (this.userPrivilegeInfo.userType === UserType.CustomerClient)) {
                            this.panels.splice(2, 1);
                            this.panels.splice(3, 2);
                    }
           }
           else {
               this.panels = [];
           }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void
    {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if ( this.drawerMode === 'over' )
        {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any
    {
        return this.panels.find(panel => panel.id === id);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
