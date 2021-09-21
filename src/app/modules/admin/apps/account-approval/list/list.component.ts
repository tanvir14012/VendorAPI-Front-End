import { IdPictureInputErrorMatcher } from './../../../../auth/account-setup/file-input-error-matcher';
import { Pagination } from './../account-approval.types';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { fromEvent, Observable, of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AccountApproval, Country } from 'app/modules/admin/apps/account-approval/account-approval.types';
import { AccountApprovalService } from 'app/modules/admin/apps/account-approval/account-approval.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDateRangeInput, MatDateRangePicker, MatStartDate } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';

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

    accountApproval$: Observable<AccountApproval[]>;

    accountApprovalCount: number = 0;
    accountApprovalTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedAccountApproval: AccountApproval;
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
        //this.accountApproval$ = this._accountApprovalsService.accountApproval$;
        this._accountApprovalsService.accountApproval$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountApproval: AccountApproval[]) => {
                accountApproval = accountApproval.slice(0, 10);
                this.accountApproval$ = of(accountApproval);
                // Update the counts
                this.accountApprovalCount = accountApproval.length;

                // Mark for check
                this._changeDetectorRef.markForCheck();

                //Set loading status
                this.isLoading = false;
            });

        // Get the AccountApproval
        this._accountApprovalsService.AccountApproval$
            .pipe(takeUntil(this._unsubscribeAll),)
            .subscribe((AccountApproval: AccountApproval) => {

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

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>

                    // Search
                    this._accountApprovalsService.searchAccountApprovals(query)
                )
            )
            .subscribe();

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

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/') // '/'
                )
            )
            .subscribe(() => {
                this.createAccountApproval();
            });


        //Pagination
        // Get the pagination
        this._accountApprovalsService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

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
     * Create AccountApproval
     */
    createAccountApproval(): void {
        // Create the AccountApproval
        this._accountApprovalsService.createAccountApproval().subscribe((newContact) => {

            // Go to the new AccountApproval
            this._router.navigate(['./', newContact.id], { relativeTo: this._activatedRoute });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * 
     * Paginate
     */
    paginate(event: PageEvent): void {
        this.isLoading = true;
        this._accountApprovalsService.accountApproval$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountApproval: AccountApproval[]) => {
                accountApproval = accountApproval.slice(event.pageIndex * event.pageSize,
                    Math.min(event.pageIndex * event.pageSize + event.pageSize, accountApproval.length));
                this.accountApproval$ = of(accountApproval);

                // Mark for check
                this._changeDetectorRef.markForCheck();

                //Set loading status
                this.isLoading = false;
            });

    }

    /**
     * 
     * Filter requests
     */
    filter(event: any): void {
        if(this.activeFilters.includes('showAll')) {
            this.activeFilters = ['showAll'];
        }

        this._accountApprovalsService.accountApproval$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountApprovals: AccountApproval[]) => {
                if(!this.activeFilters.includes('showAll')) {
                    let filteredApprovals: AccountApproval[] = [];
                    this.activeFilters.forEach(field => {
                        switch(field) 
                        {
                            case 'approved': filteredApprovals = filteredApprovals.concat(accountApprovals.filter(obj => obj.status === 'approved'));
                                break;
                            case 'pending': filteredApprovals = filteredApprovals.concat(accountApprovals.filter(obj => obj.status === 'pending'));
                                break;
                            case 'rejected': filteredApprovals = filteredApprovals.concat(accountApprovals.filter(obj => obj.status === 'rejected'));
                                break;
                            case 'read': filteredApprovals = filteredApprovals.concat(accountApprovals.filter(obj => obj.readStatus === 'read'));
                                break;
                            case 'unread': filteredApprovals = filteredApprovals.concat(accountApprovals.filter(obj => obj.readStatus === 'unread'));
                                break;
                            default: break;
                        }
                    });
                    //Select distinct approvals by comparing id property
                    accountApprovals = filteredApprovals.reduce((distinctApporvals, approval) => {
                        if(!distinctApporvals.some(appr => appr.id === approval.id)) {
                            distinctApporvals.push(approval);
                        }
                        return distinctApporvals;
                    }, []);
                }

                this.accountApproval$ = of(accountApprovals);
                this._paginator.pageIndex = 0;
                this._paginator.length = accountApprovals.length;
                this.resetDateRange();

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
            const start = new Date(dateRangeStart.value),
                end = new Date(dateRangeEnd.value);

            this._accountApprovalsService.accountApproval$
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((accountApprovals: AccountApproval[]) => {
                    accountApprovals = accountApprovals.filter(aa => new Date(aa.createdDate) >= start 
                        && new Date(aa.createdDate) <= end);

                    this.accountApproval$ = of(accountApprovals);
                    this._paginator.pageIndex = 0;
                    this._paginator.length = accountApprovals.length;

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
        }

    }

    /**
     * Reset date range
     */
    resetDateRange():void {
        this.range.get('start').setValue('');
        this.range.get('end').setValue('');
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
