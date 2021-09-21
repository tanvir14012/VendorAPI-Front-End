import { appConfig } from './../../../../../core/config/app.config';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, ElementRef, OnChanges, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccountSecurity, Country, countries } from '../settings.types';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit, AfterViewInit {
    @ViewChildren('passwordChangeSuccessAlert', { read: ElementRef }) private _passwordChangeSuccessAlert: QueryList<ElementRef>;
    @ViewChildren('emailChangeSuccessAlert', { read: ElementRef }) private _emailChangeSuccessAlert: QueryList<ElementRef>;
    @ViewChildren('phoneChangeSuccessAlert', { read: ElementRef }) private _phoneChangeSuccessAlert: QueryList<ElementRef>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    changePasswordForm: FormGroup;
    changeEmailForm: FormGroup;
    changeEmailVerificationForm: FormGroup;
    changePhoneForm: FormGroup;
    changePhoneVerificationForm: FormGroup;
    twoFASetupForm: FormGroup;
    countryList: Country[] = countries;
    accountSecurity: AccountSecurity =
        {
            id: 'lsdfjl56sdf6s4df64sdf6',
            emailChangeInProgress: false,
            emailChangeSuccess: null,
            passwordChangeSuccess: null,
            phoneChangeInProgress: false,
            phoneChangeSuccess: null,
            twoFA: 
            {
                enabled: true,
                mode: 2,
                smsConfig: {
                    hasBeenSetUp: false,
                    setupInProgress: true,
                    setupSuccess: false,
                    number: '+12563264582'
                },
                emailConfig: {
                    hasBeenSetUp: false,
                    setupInProgress: true,
                    setupSuccess: false,
                    email: 'jack@gmail.com'
                },
                appConfig: {
                    hasBeenSetUp: false,
                    setupInProgress: true,
                    setupSuccess: false,
                    appName: 'VendorAPI',
                    userId: 'jack@gmail.com',
                    qrUrl: 'https://chart.googleapis.com/chart?chs=240x240&cht=qr&chl=HJ5GHK5LJTKUFGFD6S6R6GDS2DFGJG1FGH1',
                    setUpCode: 'HJ5GHK5LJTKUFGFD6S6R6GDS2DFGJG1FGH1'
                }
            }
        };
    twoFaOptions: any[];
    verifyAuthenticatorAppForm: FormGroup;
    verify2FA_SMS_Form: FormGroup;
    verify2FA_Email_Form: FormGroup;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _renderer: Renderer2,
        private _snackBar: MatSnackBar
    ) {
       
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the change password form
        this.changePasswordForm = this._formBuilder.group({
            currentPassword: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(6)]],
            newPassword: ['', [Validators.required, Validators.maxLength(200), Validators.minLength(6)]],
        });

        // Create the change email form
        this.changeEmailForm = this._formBuilder.group({
            newEmail: ['', [Validators.required, Validators.email]]
        });

        // Create the change email verification form
        this.changeEmailVerificationForm = this._formBuilder.group({
            tokenToCurrentEmail: ['', [Validators.required, Validators.maxLength(512)]],
            tokenToNewEmail: ['', [Validators.required, Validators.maxLength(512)]]
        });

        // Create the change phone form
        this.changePhoneForm = this._formBuilder.group({
            country: ['us', [Validators.required]],
            newPhone: ['', [Validators.required]]
        });

        // Create the change phone verification form
        this.changePhoneVerificationForm = this._formBuilder.group({
            otpToNewPhone: ['', [Validators.required, Validators.maxLength(20)]]
        });

        this.twoFaOptions = [
            {
                value: 0,
                label: 'None',
                details: 'The 2FA is disabled.'
            },
            {
                value: 1,
                label: 'Authenticator App',
                details: 'A code from the authenticator application on your smartphone need to be entered at each login.'
            },
            {
                value: 2,
                label: 'SMS',
                details: 'A code will be sent to your mobile number via SMS that need to be entered at each login.'
            },
            {
                value: 3,
                label: 'Email',
                details: 'A code will be sent to your email address that need to be entered at each login.'
            }
        ];

        // 2FA form
        this.twoFASetupForm = this._formBuilder.group({
            enabled: [false, [Validators.required]],
            mode: [0]
        });

        //Auth app verification from
        this.verifyAuthenticatorAppForm = this._formBuilder.group({
            securityCode: ['', [Validators.required]]
        });

        //SMS otp verfification form
        this.verify2FA_SMS_Form = this._formBuilder.group({
            otpCode: ['', [Validators.required]]
        });

        //Email code verfification form
        this.verify2FA_Email_Form = this._formBuilder.group({
            securityCode: ['', [Validators.required]]
        });
    }

    /**
     * After View Init
     */
    ngAfterViewInit(): void {

        /*
            * Set alert dismiss button's 'type' attribute to button to prevent form submit, in change password form
         */
        this._passwordChangeSuccessAlert.changes.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((elRefList: QueryList<ElementRef>) => {
            if (elRefList && elRefList.length >= 1) {
                let nativeEl = elRefList.last.nativeElement;
                let dismissBtn = nativeEl.querySelector('button');
                this._renderer.setAttribute(dismissBtn, 'type', 'button');

            }
        });


        /*
           * Set alert dismiss button's 'type' attribute to button to prevent form submit, in change email form
        */
        this._emailChangeSuccessAlert.changes.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((elRefList: QueryList<ElementRef>) => {
            if (elRefList && elRefList.length >= 1) {
                let nativeEl = elRefList.last.nativeElement;
                let dismissBtn = nativeEl.querySelector('button');
                this._renderer.setAttribute(dismissBtn, 'type', 'button');

            }
        });

        /*
           * Set alert dismiss button's 'type' attribute to button to prevent form submit, in change phone form
        */
        this._phoneChangeSuccessAlert.changes.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((elRefList: QueryList<ElementRef>) => {
            if (elRefList && elRefList.length >= 1) {
                let nativeEl = elRefList.last.nativeElement;
                let dismissBtn = nativeEl.querySelector('button');
                this._renderer.setAttribute(dismissBtn, 'type', 'button');

            }
        });

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
    // @ Lifecycle hooks end
    // -----------------------------------------------------------------------------------------------------

    /**
     * TwoFA mode validator
     * If 2FA is enabled but the mode is not set, an error is thrown.
     */
     private twoFAmodeValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const is2FAEnabled = control.get('enabled').value;
          const twoFAmode = control.get('mode').value;
          if(is2FAEnabled && !twoFAmode) 
          {
              return 
              {
                emptyMode: true;
              }
          }
          return null;
        };
      }


    /**
     * Sumbit email change form
     */
    onPasswordChangeSubmit(): void {
        if (this.changePasswordForm.valid) {
            this.accountSecurity.passwordChangeSuccess = true;
            this.changePasswordForm.reset();
        }
    }

    /**
     * Cancel password change
     */
    cancelPasswordChange(): void {
        this.changePasswordForm.reset();
        this.accountSecurity.passwordChangeSuccess = null;
    }

    /**
     * Sumbit email change form
     */
    onEmailChangeSubmit(): void {
        if (this.accountSecurity.emailChangeInProgress) {
            if (this.changeEmailVerificationForm.valid) {
                this.accountSecurity.emailChangeSuccess = true;
                this.accountSecurity.emailChangeInProgress = false;
                this.changeEmailForm.reset();
            }
        }
        else {
            if (this.changeEmailForm.valid) {
                this.accountSecurity.emailChangeInProgress = true;
            }
        }
    }

    /**
     * Cancel email change
    */
    cancelEmailChange(): void {
        this.accountSecurity.emailChangeInProgress = false;
        this.accountSecurity.emailChangeSuccess = null;
        this.changeEmailForm.reset();
        this.changeEmailVerificationForm.reset();
    }



    /**
    * Submit email change form
    */
    onPhoneChangeSubmit(): void {
        if (this.accountSecurity.phoneChangeInProgress) {
            if (this.changePhoneVerificationForm.valid) {
                this.accountSecurity.phoneChangeSuccess = true;
                this.accountSecurity.phoneChangeInProgress = false;
                this.changePhoneForm.reset();
            }
        }
        else {
            if (this.changePhoneForm.valid) {
                this.accountSecurity.phoneChangeInProgress = true;
            }
        }
    }

    /**
    * Cancel phone change
    */
    cancelPhoneChange(): void {
        this.accountSecurity.phoneChangeInProgress = false;
        this.accountSecurity.phoneChangeSuccess = null;
        this.changePhoneForm.reset();
        this.changeEmailVerificationForm.reset();
    }



    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country {
        return this.countryList.find(country => country.iso === iso);
    }

    /**
     * 
     * Change 2FA settings 
     */
    change2FA(modeVal: number): void {
        this.twoFASetupForm.get('mode').setValue(modeVal);
        switch(modeVal) {
            case 0: break;
            case 1: this.accountSecurity.twoFA.appConfig.setupInProgress = true;
                    break;
            case 2: this.accountSecurity.twoFA.smsConfig.smsConfig.setupInProgress = true;
                    break;
            case 3: this.accountSecurity.twoFA.emailConfig.emailConfig.setupInProgress = true;
                    break;
            default: break;
        }
    }

    /**
     * 
     * Check selected 2FA setup info
     */
    check2FASetup(mode: number): boolean {
        const twoFA = this.accountSecurity.twoFA;
        switch(mode) {
            case 0: return false;
            case 1: return twoFA.appConfig.setupInProgress;
            case 2: return twoFA.smsConfig.setupInProgress;
            case 3: return twoFA.emailConfig.setupInProgress;
            default: return false;
        }
    }

    /**
     * 
     * Get 2FA option object from mode
     */
    get2FAoptionInfo(mode: number) {
        return this.twoFaOptions.find(ops => ops.value === mode);
    }

    /**
     * Open a simple snackbar
     */
     openSnackBar(message: string, action: string, timespan: number) {
        this._snackBar.open(message, action, {
            duration: timespan
        });
      }

      /**
       * On Auth app security code submit cancellation
       */
      cancelAuthAppSecurityCodeSubmit(): void {
        this.verifyAuthenticatorAppForm.reset();
      }

      /**
       * On Auth app security code submit
       */
      onAuthAppSecurityCodeSubmit(): void {
        this.accountSecurity.twoFA.appConfig.setupInProgress = false;
        this.accountSecurity.twoFA.appConfig.hasBeenSetup = true;
        this.accountSecurity.twoFA.appConfig.setupSuccess = true;
      }


      /**
       * 
       * Check if a 2FA setup is in progress
       */
      checkPendingSetup(mode: number): boolean {
        const twoFA = this.accountSecurity.twoFA;
        switch(mode) {
            case 0: return false;
            case 1: return twoFA.appConfig.setupInProgress;
            case 2: return twoFA.smsConfig.setupInProgress;
            case 3: return twoFA.emailConfig.setupInProgress;
            default: return false;
        }
      }  

    
    /**
     * 
     * @param index 
     * @param item 
     * @returns 
     */
     cancel2FA_SMS_OTP_Submit(): void {
        this.verify2FA_SMS_Form.reset();
     }

     /**
      * 
      * @param index 
      * @param item 
      * @returns 
      */
      on2FA_SMS_OTP_Submit(): void {
        this.accountSecurity.twoFA.smsConfig.setupInProgress = false;
        this.accountSecurity.twoFA.smsConfig.hasBeenSetup = true;
        this.accountSecurity.twoFA.smsConfig.setupSuccess = true;
      }

      /**
     * 
     * @param index 
     * @param item 
     * @returns 
     */
     cancel2FA_Email_OTP_Submit(): void {
        this.verify2FA_Email_Form.reset();
    }

    /**
     * 
     * @param index 
     * @param item 
     * @returns 
     */
     on2FA_Email_OTP_Submit(): void {
        this.accountSecurity.twoFA.emailConfig.setupInProgress = false;
        this.accountSecurity.twoFA.emailConfig.hasBeenSetup = true;
        this.accountSecurity.twoFA.emailConfig.setupSuccess = true;
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
