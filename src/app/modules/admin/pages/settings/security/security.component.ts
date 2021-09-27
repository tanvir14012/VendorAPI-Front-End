import { MatSelect } from '@angular/material/select';
import { AuthStatus } from './../../../../../core/auth/auth-types';
import { fuseAnimations } from '@fuse/animations';
import { AccountSecurityService } from './../../../../../core/account-security/account-security.service';
import { FuseValidators } from './../../../../../../@fuse/validators/validators';
import { appConfig } from './../../../../../core/config/app.config';
import { finalize, take, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, ElementRef, OnChanges, QueryList, ViewChildren, Renderer2, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, NgForm } from '@angular/forms';
import { AccountSecurity, Country, countries } from '../settings.types';
import { Subject, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { TwoFAStatus, UpdateTwoFAResult } from 'app/core/account-security/account-security.types';

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
        if (currPass && newPass) {
            if (currPass === newPass) {
                control.get('newPassword').setErrors({ passwordsEqual: true });
                return { passwordsEqual: true };
            }
        }
        return null;
    }

    @ViewChild('changePasswordNgForm') changePasswordNgForm: NgForm;
    @ViewChild('changeEmailNgForm') changeEmailNgForm: NgForm;
    @ViewChild('changeEmailVerificationNgForm') changeEmailVerificationNgForm: NgForm;
    @ViewChild('changePhoneNgForm') changePhoneNgForm: NgForm;
    @ViewChild('changePhoneVerificationNgForm') changePhoneVerificationNgForm: NgForm;
    @ViewChild('twoFAOptions') twoFAOptions: MatSelect;
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


    phoneChangeRequestAlert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showChangePhoneRequestAlert: boolean = false;

    phoneChangeExpiry: number | null = null;
    phoneChangeCountdown: number = 0;

    phoneChangeVerificaionAlert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showChangePhoneVerificaionAlert: boolean = false;

    
    twoFaOptions: any[];
    twoFAEditMode: boolean = false;
    authStatus: AuthStatus;
    twoFAAlert: { type: FuseAlertType; message: string } = {
        type: 'error',
        message: ''
    };
    showTwoFAAlert: boolean = false;
    twoFAStatus: TwoFAStatus;
    disableTwoFAForm: boolean = false;

    twoFAUpdateAlert: { type: FuseAlertType; message: string, recoveryCodes?: null | any[] } = {
        type: 'success',
        message: ''
    };
    showTwoFAUpdateAlert: boolean = false;

    twoFAVerificationExpiry: number | null = null;
    twoFAVerificationCountdown: number = 0;

    sessionLockSettingInProgress: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _renderer: Renderer2,
        private _snackBar: MatSnackBar,
        private _accountSecurityService: AccountSecurityService,
        private _authService: AuthService,
        private _changeDetectorRef: ChangeDetectorRef
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
        }, {
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

        //Check the email change status from local storage.
        this.checkEmailChangeStatus();

        //Check the phone change status from local storage.
        this.checkPhoneChangeStatus();

        // Create the change phone form
        this.changePhoneForm = this._formBuilder.group({
            country: ['us', [Validators.required]],
            newPhone: ['', [Validators.required, Validators.pattern("^[0-9]{5,15}$")]]
        });

        // Create the change phone verification form
        this.changePhoneVerificationForm = this._formBuilder.group({
            token: ['', [Validators.required, Validators.maxLength(6)]]
        });

        this.twoFaOptions = [
            {
                value: -1,
                label: 'Disabled',
                details: 'The 2FA is disabled.'
            },
            {
                value: 0,
                label: 'Authenticator App',
                details: 'A code from the authenticator application on your smartphone need to be entered at each login.'
            },
            {
                value: 1,
                label: 'SMS',
                details: 'A code will be sent to your phone number via SMS that need to be entered at each login.'
            },
            {
                value: 2,
                label: 'Email',
                details: 'A code will be sent to your email address that need to be entered at each login.'
            }
        ];

        // 2FA form
        this.twoFASetupForm = this._formBuilder.group({
            twoFactorOption: [this.twoFaOptions[0], [Validators.required]],
            verificationCode: ['', [Validators.minLength(6), Validators.maxLength(6)]]
        });

        //Check the phone change status from local storage.
        this.checkTwoFAVerificationStatus();

        //Auth status
        this._authService.authStatus.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((authStatus: AuthStatus) => {
            this.authStatus = authStatus; 
        });

       
        //2FA status subscription
        this._accountSecurityService.getTwoFAStatus().pipe(take(1)).subscribe();
        this._accountSecurityService.twoFAStatus$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((status: TwoFAStatus) => {
            this.twoFAStatus = status;
            this.populateTwoFAOption();
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
                    type: success ? 'success' : 'error',
                    message: success ? 'Your password has been changed successfully.' : 'Failed! Incorrect password given.'
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
                    type: success ? 'success' : 'error',
                    message: success ? 'An email with a code has been sent to the new email address. Please enter the code.' :
                        'An error occurred while sending a code to the new email address. Please try again later.'
                };
                this.showChangeEmailRequestAlert = true;
                this.changeEmailForm.enable();
                this.changeEmailNgForm.resetForm();

                //Initialize the timer
                if (success) {
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
                    type: success ? 'success' : 'error',
                    message: success ? 'Your email address has been changed successfully.' :
                        'The code is invalid or the email address is unavailable.'
                };
                this.showChangeEmailVerificaionAlert = true;
                this.changeEmailVerificationForm.enable();
                this.changeEmailVerificationNgForm.resetForm();

                if (success) {
                    this.emailChangeCountdown = 0;
                    this.emailChangeExpiry = null;
                    localStorage.removeItem('emailChangeExpiry');
                    localStorage.removeItem('newEmailAddress');
                    this.showChangeEmailRequestAlert = false;
                }

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
     * Check the email change status from local storage.
     */
    private checkEmailChangeStatus(): void {
        if (localStorage.getItem('emailChangeExpiry')) {
            try {
                const expiry = parseInt(localStorage.getItem('emailChangeExpiry'));
                //If token is not expired
                if (new Date().getTime() <= expiry) {
                    this.emailChangeExpiry = expiry;

                    //Initialize the counter
                    const remainingSeconds = Math.floor((expiry - new Date().getTime()) / 1000);
                    this.initEmailChangeCountdown(remainingSeconds);
                }
                else {
                    this.emailChangeExpiry = null;
                    localStorage.removeItem('emailChangeExpiry');
                    localStorage.removeItem('newEmailAddress');
                }

            }
            catch {
                localStorage.removeItem('emailChangeExpiry');
                localStorage.removeItem('newEmailAddress');

            }
        }
    }

    /**
     * Init countdown for email change token submit
     */
    initEmailChangeCountdown(remainingSeconds: number): void {
        this.emailChangeCountdown = remainingSeconds;

        timer(1000, 1000).pipe(
            takeWhile(() => this.emailChangeCountdown > 0),
            takeUntil(this._unsubscribeAll),
            tap(() => {
                this.emailChangeCountdown--;
                if (this.emailChangeCountdown <= 0) {
                    this.emailChangeExpiry = null;
                    localStorage.removeItem('emailChangeExpiry');
                    localStorage.removeItem('newEmailAddress');
                    this.showChangeEmailRequestAlert = false;
                }
            })
        ).subscribe();
    }



    /**
    * Submit phone change form
    */
    onPhoneChangeSubmit(): void {
        if (this.changePhoneForm.invalid) {
            this.changePhoneForm.markAllAsTouched();
            return;
        }

        this.showChangePhoneRequestAlert = false;

        this.changePhoneForm.disable();

        let credentials = this.changePhoneForm.value;
        const countryCode = this.getCountryByIso(credentials.country)?.code;
        credentials.newPhone = `${countryCode}${credentials.newPhone}`;
        delete credentials.country;

        this._accountSecurityService.sendPhoneNumberChangeToken(credentials).pipe(take(1)).subscribe(
            (success: boolean) => {
                this.phoneChangeRequestAlert = {
                    type: success ? 'success' : 'error',
                    message: success ? 'A SMS with an OTP has been sent to the new phone number. Please enter the code.' :
                        'An error occurred while sending an OTP to the new phone number. Please try again later.'
                };
                this.showChangePhoneRequestAlert = true;
                this.changePhoneForm.enable();
                this.changePhoneNgForm.resetForm();
                this.changePhoneForm.get('country').setValue('us');

                //Initialize the timer
                if (success) {
                    this.phoneChangeExpiry = new Date().getTime() + 3 * 60 * 1000;
                    localStorage.setItem('phoneChangeExpiry', this.phoneChangeExpiry.toString());
                    localStorage.setItem('newPhoneNumber', credentials.newPhone);
                    //Initialize the countdown
                    this.initPhoneChangeCountdown(3 * 60);
                }
            }
        );
    }

    /**
     * Init countdown for email change token submit
    */
    initPhoneChangeCountdown(remainingSeconds: number): void {
        this.phoneChangeCountdown = remainingSeconds;

        timer(1000, 1000).pipe(
            takeWhile(() => this.phoneChangeCountdown > 0),
            takeUntil(this._unsubscribeAll),
            tap(() => {
                this.phoneChangeCountdown--;
                if (this.phoneChangeCountdown <= 0) {
                    this.phoneChangeExpiry = null;
                    localStorage.removeItem('phoneChangeExpiry');
                    localStorage.removeItem('newPhoneNumber');
                    this.showChangePhoneRequestAlert = false;
                }
            })
        ).subscribe();
    }

    /**
    * Cancel phone change
    */
    cancelPhoneChange(): void {
        this.changePhoneNgForm.resetForm();
        this.changePhoneForm.get('country').setValue('us');
        this.showChangePhoneRequestAlert = false;
    }

    /**
     * Submit the OTP token and do the phone number change
     */
    onPhoneChangeTokenSubmit(): void {
        if (this.changePhoneVerificationForm.invalid) {
            this.changePhoneVerificationForm.markAllAsTouched();
            return;
        }

        this.showChangePhoneVerificaionAlert = false;

        this.changePhoneVerificationForm.disable();

        let credentials = this.changePhoneVerificationForm.value;
        credentials.newPhone = localStorage.getItem('newPhoneNumber');

        this._accountSecurityService.changePhoneNumber(credentials).pipe(take(1)).subscribe(
            (success: boolean) => {
                this.phoneChangeVerificaionAlert = {
                    type: success ? 'success' : 'error',
                    message: success ? 'Your phone number has been changed successfully.' :
                        'The code is invalid or the phone number is unavailable.'
                };
                this.showChangePhoneVerificaionAlert = true;
                this.changePhoneVerificationForm.enable();
                this.changePhoneVerificationNgForm.resetForm();

                if (success) {
                    this.phoneChangeCountdown = 0;
                    this.phoneChangeExpiry = null;
                    localStorage.removeItem('phoneChangeExpiry');
                    localStorage.removeItem('newPhoneNumber');
                    this.showChangePhoneRequestAlert = false;
                }
                //Refresh the access token
                this._authService.refreshUserTokens().pipe(take(1)).subscribe();
            }
        );
    }

    /**
    * Cancel email change token submit
    */
    cancelPhoneChangeTokenSubmit(): void {
        this.changePhoneVerificationNgForm.resetForm();
        this.showChangePhoneVerificaionAlert = false;
        this.phoneChangeExpiry = null;
        localStorage.removeItem('phoneChangeExpiry');
        localStorage.removeItem('newPhoneNumber');

        //Clear previous alerts (if any)
        this.showChangePhoneRequestAlert = false;
    }

    /**
     * Check the phone number change status from local storage.
     */
    private checkPhoneChangeStatus(): void {
        if (localStorage.getItem('phoneChangeExpiry')) {
            try {
                const expiry = parseInt(localStorage.getItem('phoneChangeExpiry'));
                //If token is not expired
                if (new Date().getTime() <= expiry) {
                    this.phoneChangeExpiry = expiry;

                    //Initialize the counter
                    const remainingSeconds = Math.floor((expiry - new Date().getTime()) / 1000);
                    this.initPhoneChangeCountdown(remainingSeconds);
                }
                else {
                    this.phoneChangeExpiry = null;
                    localStorage.removeItem('phoneChangeExpiry');
                    localStorage.removeItem('newPhoneNumber');
                }

            }
            catch {
                localStorage.removeItem('phoneChangeExpiry');
                localStorage.removeItem('newPhoneNumber');
            }
        }
    }

    /**
     * Compare two two factor authentication option
     */
    compareTwoFAOptions(a: any, b: any) {
        return a && b && a.value === b.value;
    }

    /**
    * Check the 2FA verification status from local storage.
    */
    checkTwoFAVerificationStatus(): void {
        if (localStorage.getItem('twoFAVerificationExpiry')) {
            try {
                const expiry = parseInt(localStorage.getItem('twoFAVerificationExpiry'));
                //If token is not expired
                if (new Date().getTime() <= expiry) {
                    this.twoFAVerificationExpiry = expiry;

                    //Initialize the counter
                    const remainingSeconds = Math.floor((expiry - new Date().getTime()) / 1000);
                    this.initTwoFAVerificationCountdown(remainingSeconds);

                    this.twoFAEditMode = true;
                }
                else {
                    this.clearTwoFactorVerificationState();
                }

            }
            catch {
                this.clearTwoFactorVerificationState();
            }
        }
    }

    /**
     * Init countdown for email change token submit
    */
    initTwoFAVerificationCountdown(remainingSeconds: number): void {
        this.twoFAVerificationCountdown = remainingSeconds;

        timer(1000, 1000).pipe(
            takeWhile(() => this.twoFAVerificationCountdown > 0),
            takeUntil(this._unsubscribeAll),
            tap(() => {
                this.twoFAVerificationCountdown--;
                if (this.twoFAVerificationCountdown <= 0) {
                    this.clearTwoFactorVerificationState();
                }
            })
        ).subscribe();
    }

    /**
     * Clears the 2FA state from local storage
     */
    clearTwoFactorVerificationState(): void {
        this.twoFAVerificationExpiry = null;
        localStorage.removeItem('twoFAVerificationExpiry');
        localStorage.removeItem('twoFAVerificationCode');
        localStorage.remove('needAuthenticatorSetup');
        localStorage.removeItem('authenticatorConfig');

        //Restore two factor option
        this.populateTwoFAOption();
        this.twoFAEditMode = false;        
    }

    /**
     * Populate 2FA option from status
     */
    populateTwoFAOption(): void {
        const value = this.twoFAStatus?.twoFAEnabled ? this.twoFAStatus.twoFactorOption : -1;
        this.twoFASetupForm.get('twoFactorOption').setValue(this.twoFaOptions.find(ops => ops.value === value));
    }


    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country {
        return this.countryList.find(country => country.iso === iso);
    }


    get2FAOptionLabel(value: number): string {
        return this.twoFaOptions.find(ops => ops.value === value)?.label;
    }

    enabletwoFAEditMode(): void {
        this.twoFAEditMode = true;
    }

    cancelTwoFAEditMode(): void {
        this.twoFAEditMode = false;
        this.showTwoFAAlert = false;
        this.populateTwoFAOption();
    }

    twoFASelectionChange(option: any): void {
        this.showTwoFAAlert = false;

        if (option.value === 1 && !this.authStatus.userPhone) {
            this.twoFAAlert = {
                type: 'error',
                message: 'You have not added a phone number yet, please add one first.'
            };
            this.showTwoFAAlert = true;
            this.disableTwoFAForm = true;
        }
        else {
            this.disableTwoFAForm = false;
        }

    }

    /**
     * getter for checking if authenticator setup in progress 
     */
    get needAuthenticatorSetup(): boolean {
        return localStorage.getItem('needAuthenticatorSetup') === 'true';
    }

    get authenticatorConfig(): any {
        return JSON.parse(localStorage.getItem('authenticatorConfig'));
    }

    /**
     * Update two FA 
     */
    updateTwoFA(): void {

        //If authenticator verification code submit
        if(this.twoFAVerificationExpiry && this.twoFASetupForm.get('verificationCode').value) {
            this.verifyAuthenticator();
            return;
        }

        if (this.twoFASetupForm.invalid || this.disableTwoFAForm) {
            return;
        }

        this.showTwoFAUpdateAlert = false;

        this.twoFASetupForm.disable();

        let creds = this.twoFASetupForm.value;
        creds.twoFactorOption = creds.twoFactorOption.value;
        if(creds.twoFactorOption == -1) {
            creds.twoFactorOption = null;
        }

        this._accountSecurityService.updateTwoFA(creds).pipe(
            take(1)
        ).subscribe((result: UpdateTwoFAResult) => {
            this.twoFASetupForm.enable();

            if(result.needAuthenticatorSetup) {
                this.twoFAVerificationExpiry = new Date().getTime() + 30 * 60 * 1000;
                    localStorage.setItem('twoFAVerificationExpiry', this.twoFAVerificationExpiry.toString());
                    localStorage.setItem('twoFAVerificationCode', result.authenticatorSetupKey);
                    localStorage.setItem('needAuthenticatorSetup', 'true');
                    let authenticatorConfig =  {
                        qr: result.qr,
                        authenticatorSetupKey: result.authenticatorSetupKey
                    };
                    localStorage.setItem('authenticatorConfig', JSON.stringify(authenticatorConfig));
                    //Initialize the countdown
                    this.initTwoFAVerificationCountdown(30 * 60);

                    this.twoFAUpdateAlert = {
                        type: 'success',
                        message: 'Please follow the steps to complete setup.',
                    };
                    this.showTwoFAUpdateAlert = true;
            }
            else if(result.succeeded) {
                this.twoFAUpdateAlert = {
                    type: 'success',
                    message: 'Two Factor authentication has been updated successfully.'
                };
                this.showTwoFAUpdateAlert = true;

                this.twoFAEditMode = false;

                //Reset counter, expirty etc.
                this.twoFAVerificationCountdown = 0;
                this.twoFAVerificationExpiry = null;
                localStorage.removeItem('twoFAVerificationExpiry');
                localStorage.removeItem('twoFAVerificationCode');    
            }

            else {
                this.twoFAUpdateAlert = {
                    type: 'error',
                    message: 'Something went wrong. Please try again later.'
                };
                this.showTwoFAUpdateAlert = true;
                this.twoFAEditMode = false;
            }
        },
        (err) => {

            this.twoFAUpdateAlert = {
                type: 'error',
                message: 'Something is went wrong. Please try again later.'
            };
            this.showTwoFAUpdateAlert = true;
            this.twoFASetupForm.enable();
            this.populateTwoFAOption();
        });
    }


    /**
     * Verify the authenticator app
     */
    verifyAuthenticator(): void {
        this.showTwoFAUpdateAlert = false;
        this.twoFASetupForm.disable();

        var credentials = {
            userId: this.authStatus.userId,
            verificationCode: this.twoFASetupForm.get('verificationCode').value
        };

        this._accountSecurityService.verifyAuthenticator(credentials).pipe(
            take(1)
        ).subscribe((result: any) => {
            if(result) {
                this.twoFAUpdateAlert = {
                    type: 'success',
                    message: 'Your authenticator app is verified and setup has been completed successfully.',
                    recoveryCodes: result.recoveryCodes
                };

                //Reset counter, expirty etc.
                this.twoFAVerificationCountdown = 0;
                this.twoFAVerificationExpiry = null;
                localStorage.removeItem('twoFAVerificationExpiry');
                localStorage.removeItem('twoFAVerificationCode');
                localStorage.removeItem('needAuthenticatorSetup');
                localStorage.removeItem('authenticatorConfig');
                this.twoFAEditMode = false;
                
            }

            else {
                this.twoFAUpdateAlert = {
                    type: 'error',
                    message: 'Invalid or expired verification code.'
                };
            }

            this.showTwoFAUpdateAlert = true;
            this.twoFASetupForm.enable();
        });

    }

    /**
     * 
     * Enable/disable session lock
     */
    onSessionLockSettingToggle(event: any): void {
        let model = {
            sessionLockEnabled: event.checked
        }

        this.sessionLockSettingInProgress = true;

        this._accountSecurityService.updateSessionLock(model).pipe(
            take(1)
        ).subscribe((resp) => {
            this._authService.refreshUserTokens().pipe(
                take(1)
            ).subscribe();
            this.sessionLockSettingInProgress = false;
            event.source.checked = resp.sessionLockEnabled;
        },
        (err) => {
            this.sessionLockSettingInProgress = false;
            event.source.checked = !event.source.checked;
        });
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
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }


}
