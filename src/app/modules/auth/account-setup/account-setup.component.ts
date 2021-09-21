import { state } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DocumentFileInputErrorMatcher, IdPictureInputErrorMatcher } from './file-input-error-matcher';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { countries, Country } from './account-setup.types';
import { Subject } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';

@Component({
    selector: 'forms-wizards',
    templateUrl: './account-setup.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AccountSetupComponent implements OnInit {
    @ViewChild('stepper') stepper: MatStepper;
    legalDocumentForm: FormGroup;
    IDInputErrorMatcher: IdPictureInputErrorMatcher;
    documentInputErrorMatcher: DocumentFileInputErrorMatcher;
    isLegalDocumentFormCompleted: boolean = true;
    phonePrefix: string = "+1";
    phonePrefix2: string = "+1";
    readonly MAX_DOC_COUNT: number = 3;
    stepperOrientation = 'horizontal';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    planBillingForm: FormGroup;
    plans: any[];
    countryList: Country[] = countries;
    yearlyBilling: boolean = true;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _breakPointObserver: BreakpointObserver) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        /**
         * Form definitions
         */
        this.legalDocumentForm = this._formBuilder.group({
            identityDocType: ['1', [Validators.required]],
            identityDoc: ['', [Validators.required]],
            identityDocFileName: ['', [Validators.required]],
            identityNumber: ['', [Validators.required]],
            country: [this.countryList[224], [Validators.required]],
            businessName: ['', [Validators.required]],
            businessAddress1: ['', [Validators.required]],
            businessAddress2: ['', [Validators.required]],
            city: ['', [Validators.required]],
            state: ['', [Validators.required]],
            zip: ['', [Validators.required]],
            phoneNumber: ['', [Validators.required]],
            website: ['', [Validators.required]],
            legalDocs: this._formBuilder.array([], [Validators.required, Validators.minLength(1), Validators.maxLength(this.MAX_DOC_COUNT)])
        });
        this.addFileInputField();

        this.IDInputErrorMatcher = new IdPictureInputErrorMatcher();
        this.documentInputErrorMatcher = new DocumentFileInputErrorMatcher();

        /**
         * Breakpoint observation for stepper orientation (vertical or horizontal)
         */
        this._breakPointObserver.observe(['(max-width: 800px)'])
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state: BreakpointState) => {
                if(state.matches) {
                    this.stepperOrientation = 'vertical';
                }
                else {
                    this.stepperOrientation = 'horizontal';
                }
            });


        /**
         * Plan and billing form
         */

        // Create the form
        this.planBillingForm = this._formBuilder.group({
            plan          : ['premium', [Validators.required]],
            firstName     : ['', [Validators.required]],
            lastName      : ['', [Validators.required]],
            address1      : ['', [Validators.required]],
            address2      : ['', [Validators.required]],
            phoneNumber   : ['', [Validators.required]],
            cardHolder    : ['', [Validators.required]],
            cardNumber    : ['', [Validators.required]],
            cardExpiration: ['', [Validators.required]],
            cardCVC       : ['', [Validators.required]],
            country       :  [this.countryList[224], [Validators.required]],
            city         : ['', [Validators.required]],
            state         : ['', [Validators.required]],
            zip           : ['', [Validators.required]]
        });

        // Setup the plans
        this.plans = [
            {
                value  : 'personal',
                label  : 'Personal',
                details: 'Perfect for an individual or a small team starting to get bigger.',
                monthlyPrice  : '9',
                yearlyPrice: '6',
                features: ['3 catalogs', 'Unlimited products', '1GB storage', 'Analytics', 'Access to forums']
            },
            {
                value  : 'premium',
                label  : 'Premium',
                details: 'Perfect for growing teams wanting to be in more control',
                monthlyPrice  : '15',
                yearlyPrice: '12',
                features: ['5 catalogs', 'Unlimited products', '3GB storage', 'Analytics', '12/5 Support']
            },
            {
                value  : 'enterprise',
                label  : 'Enterprise',
                details: 'Perfect for companies wanting advanced tools and support',
                monthlyPrice  : '69',
                yearlyPrice: '49',
                features: ['20 catalogs', 'Unlimited products', 'Unlimited storage', 'Advanced analytics', '24/7 Support']
            }
        ];
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
 

    /**
     * Upload ID image
     *
     * @param fileList
     */
    uploadID(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/gif'];
        const file = fileList[0];

        this.legalDocumentForm.get('identityDoc').setValue(file);
        this.legalDocumentForm.get('identityDocFileName').setValue(file.name);

        // Add error if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            this.legalDocumentForm.get('identityDocFileName').setErrors({ 'notAllowed': true });
        }
        else {
            this.legalDocumentForm.get('identityDocFileName').setErrors({ 'notAllowed': null });
            this.legalDocumentForm.get('identityDocFileName').updateValueAndValidity();
        }

         //Add error if the file is too big
         const fileSize = file.size / (1024 * 1024);
         if(fileSize > 5.0) {
            this.legalDocumentForm.get('identityDocFileName').setErrors({ 'fileSizeLimitExceeded': true });
         }
         else {
            this.legalDocumentForm.get('identityDocFileName').setErrors({ 'fileSizeLimitExceeded': null });
            this.legalDocumentForm.get('identityDocFileName').updateValueAndValidity();
         }
    }

    /**
     * Country select change event handler
     */
    countryChange(country: Country): void {
        this.phonePrefix = country.code;
    }

    /**
     * Country select change event handler
     */
     countryChange2(country: Country): void {
        this.phonePrefix2 = country.code;
    }


    /**
     * Compares two country object
     * @param a: first country
     * @param b: second country
     * @returns boolean indicating if they are equal
     */
    compareCountries(a: Country, b: Country): boolean {
        return a && b && a.id === b.id;
    }

    /**
     * Add the file input field for legal documents
     */
    addFileInputField(): void {
        let legalDocsFormArray = this.legalDocumentForm.get('legalDocs') as FormArray;

        if (legalDocsFormArray.length >= this.MAX_DOC_COUNT) {
            return;
        }
        // Create a file input form group
        const fileInputGroup = this._formBuilder.group({
            fileSource: ['', [Validators.required]],
            fileName: ['', [Validators.required]]
        });

        // Add the file input form group to the legalDocs form array
        legalDocsFormArray.push(fileInputGroup);

        let test = this.legalDocumentForm.get('legalDocs')['controls'];

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the file input field
     *
     * @param index
     */
    removeFileInputField(index: number): void {
        // Get form array for file inputs
        const legalDocsFormArray = this.legalDocumentForm.get('legalDocs') as FormArray;

        // Remove the email field
        legalDocsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Upload legal document
     *
     * @param fileList
     */
    uploadDocument(fileList: FileList, control: FormControl): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['text/plain', 'text/rtf', 'application/rtf', 'text/html', 'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        const file = fileList[0];

        control.get('fileSource').setValue(file);
        control.get('fileName').setValue(file.name);

        // Add error if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            control.get('fileName').setErrors({ 'notAllowed': true });
        }
        else {
            control.get('fileName').setErrors({ 'notAllowed': null });
            control.get('fileName').updateValueAndValidity();
        }

        //Add error if the file is too big
        const fileSize = file.size / (1024 * 1024);
        if(fileSize > 10.0) {
            control.get('fileName').setErrors({ 'fileSizeLimitExceeded': true });
        }
        else {
            control.get('fileName').setErrors({ 'fileSizeLimitExceeded': null });
            control.get('fileName').updateValueAndValidity();
        }
    }

    /**
     * On legal document forms submit
     */
     onDocSubmit(): void {
         console.log(this.legalDocumentForm.value);
         console.log(this.legalDocumentForm);
     }

     /**
      * 
      * Plan and billing form submit
      */
      onPlanAndBillingSubmit(): void {
          if(this.planBillingForm.valid) {
              this.stepper.next();
          }
          console.log(this.planBillingForm);
      }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return index;
    }
}
