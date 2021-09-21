import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AccountApproval, Country } from 'app/modules/admin/apps/account-approval/account-approval.types';
import { AccountApprovalListComponent } from 'app/modules/admin/apps/account-approval/list/list.component';
import { AccountApprovalService } from 'app/modules/admin/apps/account-approval/account-approval.service';

@Component({
    selector       : 'account-approval-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountApprovalDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    previewMode: boolean = false;
    accountApproval: AccountApproval;
    accountApprovalForm: FormGroup;
    accountApprovals: AccountApproval[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    countries: Country[];
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{align: []}, {list: 'ordered'}, {list: 'bullet'}],
            ['clean']
        ]
    };
    pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _accountApprovalsListComponent: AccountApprovalListComponent,
        private _accountApprovalsService: AccountApprovalService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
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
        // Open the drawer
        this._accountApprovalsListComponent.matDrawer.open();

        // Create the AccountApproval form
        this.accountApprovalForm = this._formBuilder.group({
            
        });

        // Get the account-approval list
        this._accountApprovalsService.accountApproval$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountApprovals: AccountApproval[]) => {
                this.accountApprovals = accountApprovals;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

         // Get the selected approval
         this._accountApprovalsService.AccountApproval$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountApproval: AccountApproval) => {

                // Open the drawer in case it is closed
                this._accountApprovalsListComponent.matDrawer.open();

                // Get the account approval
                this.accountApproval = accountApproval;

                // Close preview
                this.previewMode = false;
                this._changeDetectorRef.markForCheck();
         });

        // Get the country telephone codes
        this._accountApprovalsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((list: Country[]) => {
                this.countries = list;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._accountApprovalsListComponent.matDrawer.close();
    }
   
    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country
    {
        return this.countries.find(country => country.iso === iso);
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


    /**
     * Accept a request
     */

    accept(): void {
        this._fuseConfirmationService.open({
            title: "Confirm action",
            message: "Are you sure you want to approve the request?",
            icon: {
                name: "heroicons_outline:exclamation-circle",
                color: "primary",
                show: true
            },
            actions: {
                confirm: {
                    label: "Approve",
                    color:"primary",
                    show: true
                },
                cancel: {
                    label: "Cancel",
                    show: true
                }
            },
            dismissible: false
        }).afterClosed().subscribe((result) => {
            
        });
    }


    
    /**
     * Reject a request
     */

     reject(): void {
        this._fuseConfirmationService.open({
            title: "Confirm action",
            message: "Are you sure you want to reject the request?",
            icon: {
                name: "heroicons_outline:exclamation-circle",
                color: "warn",
                show: true
            },
            actions: {
                confirm: {
                    label: "Reject",
                    color:"warn",
                    show: true
                },
                cancel: {
                    label: "Cancel",
                    show: true
                }
            },
            dismissible: false
        }).afterClosed().subscribe((result) => {
          
        });
    }


    /**
     * Preview document
     */
    preview(index: number): void {
        this.previewMode = true;
        const cdkScroller = this._accountApprovalsListComponent.matDrawer
            ._container._content.getElementRef()
            .nativeElement.parentElement
            .childNodes[3].childNodes[0];
        
        this._renderer2.addClass(cdkScroller, 'overflow-y-hidden');
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Close preview
     */
    
    /**
     * Preview document
     */
     closePreview(): void {
        this.previewMode = false;
        const cdkScroller = this._accountApprovalsListComponent.matDrawer
            ._container._content.getElementRef()
            .nativeElement.parentElement
            .childNodes[3].childNodes[0];
        
        this._renderer2.removeClass(cdkScroller, 'overflow-y-hidden');
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Download file
     */
    download(src: string): void {
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = src;
        link.download = src;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}
