import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Country } from 'app/core/account-approval/account-approval.types';
import { AccountApprovalListComponent } from 'app/modules/admin/apps/account-approval/list/list.component';
import { AccountApprovalService } from 'app/core/account-approval/account-approval.service';

@Component({
    selector: 'account-approval-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountApprovalDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    previewMode: boolean = false;
    accountApproval: any;
    accountApprovalForm: FormGroup;
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    countries: Country[];
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
            ['clean']
        ]
    };
    verdictMessage: any;

    previewDoc: any = {
        fileName: 'pdf-test.pdf',
        fileExt: '.pdf',
        src: 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf'
    }

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
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this._accountApprovalsListComponent.matDrawer.open();

        // Get the selected approval
        this._accountApprovalsService.selectedAccountApproval$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((accountApproval: any) => {

                // Open the drawer in case it is closed
                this._accountApprovalsListComponent.matDrawer.open();

                //Mark as read
                accountApproval.isRead = true;

                // Get the account approval
                this.accountApproval = accountApproval;

                // Close preview
                this.previewMode = false;

                //Mark it as read
                this.markReadStatus(accountApproval.id, true);

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
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._accountApprovalsListComponent.matDrawer.close();
    }

    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country {
        if (iso == 'us') {
            return this.countries[224];
        }
        return this.countries.find(country => country.iso === iso);
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
                    color: "primary",
                    show: true
                },
                cancel: {
                    label: "Cancel",
                    show: true
                }
            },
            dismissible: false
        }).afterClosed().subscribe((result) => {
            if(result) {
                const model = {
                    id: this.accountApproval.id,
                    isApproved: true,
                    message: this.verdictMessage
                };
                
                this._accountApprovalsService.makeVerdict(model).pipe(
                    take(1)
                ).subscribe((approval) => {
                    this.accountApproval = approval;
                    let model = this._accountApprovalsListComponent
                        .accountApprovals.find(aa => aa.id === approval.id);

                    if(!model) {
                        model = this._accountApprovalsListComponent
                            .realtimeApprovalRequests.getValue().find(aa => aa.id === approval.id);
                    }

                    if(model) {
                        model.isApproved = approval.isApproved;
                        this._accountApprovalsListComponent.detectChanges();
                    }
                    this.verdictMessage = '';
                    this._changeDetectorRef.markForCheck();
                });
            }

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
                    color: "warn",
                    show: true
                },
                cancel: {
                    label: "Cancel",
                    show: true
                }
            },
            dismissible: false
        }).afterClosed().subscribe((result) => {
            if(result) {
                const model = {
                    id: this.accountApproval.id,
                    isApproved: false,
                    message: this.verdictMessage
                };

                this._accountApprovalsService.makeVerdict(model).pipe(
                    take(1)
                ).subscribe((approval) => {
                    this.accountApproval = approval;
                    let model = this._accountApprovalsListComponent
                        .accountApprovals.find(aa => aa.id === approval.id);

                    if(!model) {
                        model = this._accountApprovalsListComponent
                            .realtimeApprovalRequests.getValue().find(aa => aa.id === approval.id);
                    }

                    if(model) {
                        model.isApproved = approval.isApproved;
                        this._accountApprovalsListComponent.detectChanges();
                    }
                    
                    this.verdictMessage = '';
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }

    /**
     * Mark read status
     */
    markReadStatus(id: number, isRead: boolean): void {
        let model = {
            id: id,
            isRead: isRead
        };

        this._accountApprovalsService.markReadStatus(model).pipe(take(1)).subscribe((isRead) => {
            this.accountApproval.isRead = isRead;
            let approvalReq = this._accountApprovalsListComponent.accountApprovals.find(aa => aa.id == id);
            if(!approvalReq) {
                approvalReq = this._accountApprovalsListComponent.realtimeApprovalRequests
                    .getValue().find(aa => aa.id == id);
            }

            if(approvalReq) {
                approvalReq.isRead = isRead;
                this._accountApprovalsListComponent.detectChanges();
            }
           
        });
    }


    /**
     * Preview document
     */
    preview(doc: any, ext: string): void {

        this._accountApprovalsService.getFileForPreview(doc.filePath).pipe(
            take(1)
        ).subscribe((resp) => {
            this.previewMode = true;
            this.previewDoc = doc;
            if(['.png', '.jpg', '.jpeg', '.gif', '.tiff'].includes(ext)) {
                resp.src = 'data:image/png;base64,' + resp.src;
            }
            this.previewDoc.src = resp.src;
            const cdkScroller = this._accountApprovalsListComponent.matDrawer
                ._container._content.getElementRef()
                .nativeElement.parentElement
                .childNodes[3].childNodes[0];

            this._renderer2.addClass(cdkScroller, 'overflow-y-hidden');
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

    }

    /**
     * Download document
     */
    downloadFile(path: string, fileName: string): void {
        this._accountApprovalsService.downloadFile(path).pipe(
            take(1)
        ).subscribe((resp) => {
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(resp.body);
            downloadLink.setAttribute('download', fileName);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();
        });

    }

    /**
     * Close preview
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
    download(src: string, name: string): void {
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.setAttribute('download', name);
        link.href = src;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}
