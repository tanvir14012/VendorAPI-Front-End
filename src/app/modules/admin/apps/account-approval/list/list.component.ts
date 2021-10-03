import { environment } from 'environments/environment';
import { IdPictureInputErrorMatcher } from './../../../../auth/account-setup/file-input-error-matcher';
import { Pagination } from '../../../../../core/account-approval/account-approval.types';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { Subject, BehaviorSubject } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {  Country } from 'app/core/account-approval/account-approval.types';
import { AccountApprovalService } from 'app/core/account-approval/account-approval.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import  * as signalR from '@microsoft/signalr';

@Component({
    selector: 'account-approval-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountApprovalListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    @ViewChild(MatPaginator) private _paginator: MatPaginator;

    accountApprovals: any[];

    accountApprovalCount: number = 0;
    accountApprovalTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedAccountApproval: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    calSettings: any =
        {
            dateFormat: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'll'],
            timeFormat: ['12', '24'],
            startWeekOn: [6, 0, 1]
        }
    pagination: Pagination;
    range = new FormGroup({
        start: new FormControl(),
        end: new FormControl()
    });
    isLoading: boolean = true;
    activeFilters: string[] = ['showAll'];
    hubConnect: signalR.HubConnection;
    realtimeApprovalRequests: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _accountApprovalsService: AccountApprovalService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the account-approval
        this._accountApprovalsService.getAccountApprovals(
            this.getFilterModel(0, 5)
        ).pipe(take(1)).subscribe();

        this._accountApprovalsService.accountApprovals$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountApproval: any) => {
                this.accountApprovals = accountApproval.businessVerificationRequests;
                // Update the counts
                this.accountApprovalCount = accountApproval.count;

                // Mark for check
                this._changeDetectorRef.markForCheck();

                //Set loading status
                this.isLoading = false;
            });

        // Get the AccountApproval
        this._accountApprovalsService.selectedAccountApproval$
            .pipe(takeUntil(this._unsubscribeAll),)
            .subscribe((AccountApproval: any) => {

                // Update the selected AccountApproval
                this.selectedAccountApproval = AccountApproval;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the countries
        this._accountApprovalsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((countries: Country[]) => {

                // Update the countries
                this.countries = countries;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected AccountApproval when drawer closed
                this.selectedAccountApproval = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                }
                else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



        //Pagination
        this._accountApprovalsService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {

                // Update the pagination
                this.pagination = pagination;

                if(this._paginator) {
                    this._paginator.pageIndex = pagination.startIndex;
                    this._paginator.length = pagination.length;
                    this._paginator.pageSize = pagination.size;
                }
                

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        //Manage signalR connection
        this.manageHubConnection();    

        //Reset realtime requests
        this.realtimeApprovalRequests.next([]);

    }

    /**
     * On viewInit
     */
    ngAfterViewInit(): void {

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Get filter model
     */
    getFilterModel(pageNo: number, entryPerPage: number): any {
        const model = {
            approverId: 0,
            startDate:  this.range.get('start').value,
            endDate: this.range.get('end').value,
            pageNo: pageNo,
            enteryPerPage: entryPerPage,
            filters: this.activeFilters.map((val) => {
                switch(val) {
                    case 'showAll': return 0;
                    case 'pending': return 1;
                    case 'approved': return 2;
                    case 'rejected': return 3;
                    case 'read': return 4;
                    case 'unread': return 5;
                    default: return 0;
                }
            })
        };

        localStorage.setItem('accountApprovalFilter', JSON.stringify(model));

        return model;
    }


    /**
     * 
     * Paginate
     */
    paginate(event: PageEvent): void {
        this.isLoading = true;
        this._accountApprovalsService.getAccountApprovals(
            this.getFilterModel(event.pageIndex, event.pageSize)
        ).pipe(take(1)).subscribe((accountApproval: any[]) => {
                //Set loading status
                this.isLoading = false;
        });
    }

    /**
     * 
     * Filter requests
     */
    filter(event: any): void {
        this.resetDateRange();
        if(this.activeFilters.includes('showAll')) {
            this.activeFilters = ['showAll'];
        }

        this.isLoading = true;
        this._accountApprovalsService.getAccountApprovals(
            this.getFilterModel(0, 5)
        ).pipe(take(1)).subscribe((accountApproval: any[]) => {
                //Set loading status
                this.isLoading = false;
        });
    }

    /**
     * Filter by  mat-select compare function
     */
     compareFilterItems(a: string, b: string) {
        return a === b;
     }

    /**
     * 
     * Date range filter 
     */
    dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
        if (dateRangeStart.value && dateRangeEnd.value) {
                this.isLoading = true;
                this._accountApprovalsService.getAccountApprovals(
                    this.getFilterModel(0, this.pagination?.size ? this.pagination.size: 5)
                ).pipe(take(1)).subscribe((accountApproval: any) => {
                        //Set loading status
                        this.isLoading = false;
                });
        }

    }

    /**
     * Reset date range
     */
    resetDateRange():void {
        this.range.get('start').setValue('');
        this.range.get('end').setValue('');

        this.isLoading = true;
        this._accountApprovalsService.getAccountApprovals(
            this.getFilterModel(0, this.pagination?.size ? this.pagination.size: 5)
        ).pipe(take(1)).subscribe((accountApproval: any) => {
            //Set loading status
            this.isLoading = false;
        });        
    }

    /**
     * Detect changes
     */
    detectChanges(): void {
        this._changeDetectorRef.markForCheck();
    }


    /**
     * Manage SignalR hub connection
     */
    manageHubConnection(): void {
        if(!this.hubConnect) {
            this.hubConnect = new signalR.HubConnectionBuilder()
                .configureLogging(signalR.LogLevel.Debug)
                .withUrl(`${environment.ApiRoot}/approvalNotificationHub`, {
                    accessTokenFactory: () => localStorage.getItem('accessToken')
                }).build();

            this.hubConnect.on('newApprovalReqest', (newRequest: any) => {
                let realtimeRequests = this.realtimeApprovalRequests.getValue();
                realtimeRequests = realtimeRequests.filter(r => r.id !== newRequest.id);
                this.realtimeApprovalRequests.next([...realtimeRequests, newRequest]);

                //If request retried, remove it from list.
                const idx = this.accountApprovals.findIndex(aa => aa.id === newRequest.id);
                if(idx !== -1) {
                    this.accountApprovals.splice(idx, 1);
                }
            });
        }

        this.hubConnect.start().then(() => {
            console.log('signalR connection established');
        }).catch((err) => {
            console.log('signalR connection error occurred');
            console.log(err);
        })
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
