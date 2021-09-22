import { fuseAnimations } from '@fuse/animations';
import { AccountSecurityService } from './../../../../../core/account-security/account-security.service';
import { FuseValidators } from './../../../../../../@fuse/validators/validators';
import { appConfig } from './../../../../../core/config/app.config';
import { finalize, take, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, ElementRef, OnChanges, QueryList, ViewChildren, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, NgForm } from '@angular/forms';
import { AccountSecurity, Country, countries } from '../settings.types';
import { Subject, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class SettingsSecurityComponent implements OnInit, AfterViewInit {
    private _currentAndNewPasswordEquality: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const currPass = control.get('currentPassword')?.value;
        const newPass = control.get('newPassword')?.value;
        if(currPass && newPass) {
            if(currPass === newPass) {
                control.get('newPassword').setErrors({passwordsEqual: true});
                return {passwordsEqual: true};
            }
        }
        return null;
    }

    @ViewChild('changePasswordNgForm') changePasswordNgForm: NgForm;
    @ViewChild('changeEmailNgForm') changeEmailNgForm: NgForm;
    @ViewChild('changeEmailVerificationNgForm') changeEmailVerificationNgForm: NgForm;
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

    passwordChangeAlert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showChangePasswordAlert: boolean = false;

    emailChangeRequestAlert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showChangeEmailRequestAlert: boolean = false;

    emailChangeExpiry: number | null = null;
    emailChangeCountdown: number = 0;

    emailChangeVerificaionAlert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showChangeEmailVerificaionAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _renderer: Renderer2,
        private _snackBar: MatSnackBar,
        private _accountSecurityService: AccountSecurityService,
        private _authService: AuthService
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
            currentPassword: ['', [Validators.required, Validators.maxLength(64), Validators.minLength(6),
                Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).*$")]],

            newPassword: ['', [Validators.required, Validators.maxLength(64), Validators.minLength(6),
                Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).*$")]],

            confirmNewPassword: ['', [Validators.required]]
        },  {
            validators: [this._currentAndNewPasswordEquality, FuseValidators.mustMatch('newPassword', 'confirmNewPassword')]
        });

        // Create the change email form
        this.changeEmailForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]]
        });

        // Create the change email verification form
        this.changeEmailVerificationForm = this._formBuilder.group({
            token: ['', [Validators.required, Validators.maxLength(6)]]
        });

        /**
         * Check the email change status from local storage.
         */
        this.checkEmailChangeStatus();

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
        if (this.changePasswordForm.invalid) {
            this.changePasswordForm.markAllAsTouched();
            return;
        }

        this.showChangePasswordAlert = false;

        this.changePasswordForm.disable();

        let credentials = this.changePasswordForm.value;
        delete credentials.confirmNewPassword;

        this._accountSecurityService.changePassword(credentials).pipe(take(1)).subscribe(
            (success: boolean) => {
                this.passwordChangeAlert = {
                    type: success ? 'success': 'error',
                    message: success ? 'Your password has been changed successfully.': 'Failed! Incorrect password given.'
                };
                this.showChangePasswordAlert = true;
                this.changePasswordForm.enable();
                this.changePasswordNgForm.resetForm();   
            }
        );
                 
        
    }

    /**
     * Cancel password change
     */
    cancelPasswordChange(): void {
        this.changePasswordNgForm.resetForm(); 
        this.showChangePasswordAlert = false;
    }

    /**
     * Sumbit email change request form to send token in email
     */
    onEmailChangeSubmit(): void {
        if (this.changeEmailForm.invalid) {
            this.changeEmailForm.markAllAsTouched();
            return;
        }

        this.showChangeEmailRequestAlert = false;

        this.changeEmailForm.disable();

        let credentials = this.changeEmailForm.value;

        this._accountSecurityService.sendEmailChangeToken(credentials).pipe(take(1)).subscribe(
            (success: boolean) => {
                this.emailChangeRequestAlert = {
                    type: success ? 'success': 'error',
                    message: success ? 'An email with a code has been sent to the new email address. Please enter the code.':
                     'An error occurred while sending a code to the new email address. Please try again later.'
                };
                this.showChangeEmailRequestAlert = true;
                this.changeEmailForm.enable();
                this.changeEmailNgForm.resetForm();   

                //Initialize the timer
                if(success) {
                    this.emailChangeExpiry = new Date().getTime() + 3 * 60 * 1000;
                    localStorage.setItem('emailChangeExpiry', this.emailChangeExpiry.toString());
                    localStorage.setItem('newEmailAddress', credentials.email);
                    //Initialize the countdown
                    this.initEmailChangeCountdown(3 * 60);
                }
            }
        );
    }

    /**
     * Cancel email change
    */
    cancelEmailChange(): void {
        this.changeEmailNgForm.resetForm();
        this.showChangeEmailRequestAlert = false;
    }

    /**
     * Submit the token and do the change
     */
    onEmailChangeTokenSubmit(): void {
        if (this.changeEmailVerificationForm.invalid) {
            this.changeEmailVerificationForm.markAllAsTouched();
            return;
        }

        this.showChangeEmailVerificaionAlert = false;

        this.changeEmailVerificationForm.disable();

        let credentials = this.changeEmailVerificationForm.value;
        credentials.newEmail = localStorage.getItem('newEmailAddress');

        this._accountSecurityService.changeEmail(credentials).pipe(take(1)).subscribe(
            (success: boolean) => {
                this.emailChangeVerificaionAlert = {
                    type: success ? 'success': 'error',
                    message: success ? 'Your email address has been changed successfully.':
                     'The code is invalid or the email address is unavailable.'
                };
                this.showChangeEmailVerificaionAlert = true;
                this.changeEmailVerificationForm.enable();
                this.changeEmailVerificationNgForm.resetForm();   

                this.emailChangeCountdown = 0;
                this.emailChangeExpiry = null;
                localStorage.removeItem('emailChangeExpiry');
                localStorage.removeItem('newEmailAddress');
                this.showChangeEmailRequestAlert = false;
                
                //Refresh the access token
                this._authService.refreshUserTokens().pipe(take(1)).subscribe();
            }
        );
    }

    /**
     * Cancel email change token submit
    */
     cancelEmailChangeTokenSubmit(): void {
        this.changeEmailVerificationNgForm.resetForm();
        this.showChangeEmailVerificaionAlert = false;
        this.emailChangeExpiry = null;
        localStorage.removeItem('emailChangeExpiry');
        localStorage.removeItem('newEmailAddress');

        //Clear previous alerts (if any)
        this.showChangeEmailRequestAlert = false;
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


    /**
     * Check the email change status from local storage.
     */
    private checkEmailChangeStatus(): void {
        if(localStorage.getItem('emailChangeExpiry')) {
            try {
                const expiry = parseInt(localStorage.getItem('emailChangeExpiry'));
                //If token is not expired
                if(new Date().getTime() <= expiry) {
                    this.emailChangeExpiry = expiry;

                    //Initialize the counter
                    const remainingSeconds = Math.floor((expiry - new Date().getTime())/1000);
                    this.initEmailChangeCountdown(remainingSeconds);
                }
                else {
                    this.emailChangeExpiry = null;
                    localStorage.removeItem('emailChangeExpiry');
                    localStorage.removeItem('newEmailAddress');
                }

            }
            catch{
                localStorage.removeItem('emailChangeExpiry');
                localStorage.removeItem('newEmailAddress');

            }
        }
    }

    /**
     * Init countdown for email change token submit
     */
    initEmailChangeCountdown(remainingSeconds: number):void {
        this.emailChangeCountdown = remainingSeconds;
        
        timer(1000, 1000).pipe(
            takeWhile(() => this.emailChangeCountdown > 0),
            takeUntil(this._unsubscribeAll),
            tap(() => {
                this.emailChangeCountdown--; 
                if(this.emailChangeCountdown <= 0) {
                    this.emailChangeExpiry = null;
                    localStorage.removeItem('emailChangeExpiry');
                    localStorage.removeItem('newEmailAddress');
                    this.showChangeEmailRequestAlert = false;
                }
            })
        ).subscribe();
    }


}
