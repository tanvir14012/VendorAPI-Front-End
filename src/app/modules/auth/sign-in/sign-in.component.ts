import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AccountStatus } from 'app/core/auth/auth-types';
import { AuthService } from 'app/core/auth/auth.service';
import { Subject, timer } from 'rxjs';
import { take, takeUntil, takeWhile, tap } from 'rxjs/operators';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    @ViewChild('twoFANgForm') twoFANgForm: NgForm;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    alert: { type: FuseAlertType; message: string, validationMessages?: null } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    lastEmail: string = null;

    twoFactorSignInExpiry: number | null = null;
    twoFactorSignInCountdown: number = 0;
    twoFAForm: FormGroup;
    twoFAAlert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showTwoFAAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: ['shantgrylls@gmail.com', [Validators.required, Validators.email, Validators.maxLength(255)]],
            password: ['Admin@123', [Validators.required, Validators.minLength(6), Validators.maxLength(64),
                 Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).*$")]],
            rememberMe: [false, []]
        });

        // Create the 2FA form
        this.twoFAForm = this._formBuilder.group({
            verificationToken: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
            rememberMe: [false, []],
            isRecoveryToken: [false, []]
        });

        //Check if state is in the middle of 2FA sign in
        this.checkTwoFASigninStatus();
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
     * Sign in
     */
    signIn(): void {

        // Reset last email
        this.lastEmail = null;

        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        //Set remebmer me to localstorage for use in 2FA
        localStorage.setItem('rememberMe', this.signInForm.get('rememberMe').value);

        // Sign in
        this._authService.signIn(this.signInForm.value).pipe(
            take(1)
        ).subscribe(
                (signinResult: any) => {

                    if (signinResult.succeeded) {

                        // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                        // to the correct page after a successful sign in. This way, that url can be set via
                        // routing file and we don't have to touch here.
                        const redirectURL = '/signed-in-redirect';

                        // Navigate to the redirect url
                        this._router.navigateByUrl(redirectURL); 
                    }

                    else if (signinResult.confirmationRequired) {
                        this.lastEmail = this.signInForm.get('email').value;
                        this.enableAlert({
                            type: 'error',
                            message: signinResult.errorMessage
                        });
                    }

                    else if (signinResult.validationFailed) {
                       
                        this.enableAlert({
                            type: 'error',
                            message: 'Input validation errors',
                            validationMessages: signinResult.errorMessage.split("|")
                        });
                        
                    }

                    else if(signinResult.requiredTwoFactorOption != null) {

                        this.twoFAForm.get('rememberMe').setValue(localStorage.getItem('rememberMe') === 'true');
                        localStorage.setItem('twoFactorSignInOption', signinResult.requiredTwoFactorOption);
                        localStorage.setItem('twoFactorSignInUserId', signinResult.userId);
                        if(signinResult.jwtForAuthenticator) {
                            localStorage.setItem('jwtForAuthenticator', signinResult.jwtForAuthenticator);
                        }

                        //Start coundown timer
                        this.twoFactorSignInExpiry = new Date().getTime() + 3 * 60 * 1000;
                        localStorage.setItem('twoFactorSignInExpiry', this.twoFactorSignInExpiry.toString());
                        //Initialize the countdown
                        this.initTwoFASigninCountdown(3 * 60);                                
                            
                    }

                    else {
                        this.enableAlert({
                            type: 'error',
                            message: signinResult.errorMessage
                        });
                    }


                },
                (err) => {
                    this.enableAlert({
                        type: 'error',
                        message: 'Incorrect email or password'
                    });

                }
            );
    }


    /**
     * Getter for two factor sign-in option
     */
    get twoFactorSignOption() {
        return  localStorage.getItem('twoFactorSignInOption');
    }
    
    twoFAProvider(option: string): string {
        switch(option) {
            case '0': return 'authenticator app';
            case '1': return 'phone number';
            case '2': return 'email address';
            default: return '';
        
        }
    }

    /**
     * Submit 2FA token
     */
    submitTwoFAToken(): void {
        // Return if the form is invalid
        if (this.twoFAForm.invalid) {
            return;
        }

        // Disable the form
        this.twoFAForm.disable();

        // Hide the alert
        this.showTwoFAAlert = false;

        let credentials = this.twoFAForm.value;
        credentials.userId = parseInt(localStorage.getItem('twoFactorSignInUserId'));
        credentials.jwtForAuthenticator = localStorage.getItem('jwtForAuthenticator');

        this._authService.signInByTwoFAToken(credentials).pipe(
            take(1)
        ).subscribe((signinResult: any) => {
            if (signinResult.succeeded) {

                // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                // to the correct page after a successful sign in. This way, that url can be set via
                // routing file and we don't have to touch here.
                const redirectURL = '/signed-in-redirect';

                //Clear 2FA state
                this.clearTwoFAState();

                // Navigate to the redirect url
                this._router.navigateByUrl(redirectURL); 
            }
            else {
                this.enableFaileTwoFAAlert();
            }
        },
        
        (err) => {
            this.enableFaileTwoFAAlert();
        });
    }

    /**
     * Enable failed 2FA attempt alert
     */
    enableFaileTwoFAAlert(): void {
        // Re-enable the form
        this.twoFAForm.enable();

        //Set remember me value
        this.twoFAForm.get('rememberMe').setValue(localStorage.getItem('rememberMe') === 'true');

        // Set the alert
        this.twoFAAlert = {
            type: 'error',
            message: 'Incorrect or expired code'
        }

        // Show the alert
        this.showTwoFAAlert = true;
    }
    
    /**
     * Cancel the sign-in
     */
    cancelTwoFactorSignIn(): void {
        this.twoFactorSignInExpiry = null;
        localStorage.removeItem('twoFactorSignInExpiry');
        localStorage.removeItem('twoFactorSignInOption');
        localStorage.removeItem('twoFactorSignInUserId');
        localStorage.removeItem('jwtForAuthenticator');
        this.signInForm?.enable();
        this.signInNgForm?.resetForm();
    }

    /**
     * Enable the form and show the alert message.
     * @param alert 
     */
    private enableAlert(alert: any): void {
        // Re-enable the form
        this.signInForm.enable();

        // Reset the form
        this.signInNgForm.resetForm();

        //Set remember me value
        this.signInForm.get('rememberMe').setValue(false);

        // Set the alert
        this.alert = alert;

        // Show the alert
        this.showAlert = true;
    }

    /**
     * Init countdown for 2FA token submit
    */
         initTwoFASigninCountdown(remainingSeconds: number): void {
            this.twoFactorSignInCountdown = remainingSeconds;
    
            timer(1000, 1000).pipe(
                takeWhile(() => this.twoFactorSignInCountdown > 0),
                takeUntil(this._unsubscribeAll),
                tap(() => {
                    this.twoFactorSignInCountdown--;
                    if (this.twoFactorSignInCountdown <= 0) {
                        this.clearTwoFAState();
                    }
                })
            ).subscribe();
        }

    /**
    * Check the 2FA sign in status from local storage.
    */
     checkTwoFASigninStatus(): void {
        if (localStorage.getItem('twoFactorSignInExpiry')) {
            try {
                this.twoFAForm.get('rememberMe').setValue(localStorage.getItem('rememberMe') === 'true');
                const expiry = parseInt(localStorage.getItem('twoFactorSignInExpiry'));
                //If token is not expired
                if (new Date().getTime() <= expiry) {
                    this.twoFactorSignInExpiry = expiry;

                    //Initialize the counter
                    const remainingSeconds = Math.floor((expiry - new Date().getTime()) / 1000);
                    this.initTwoFASigninCountdown(remainingSeconds);
                }
                else {
                    this.clearTwoFAState();
                }

            }
            catch {
                this.clearTwoFAState();                
            }
        }
    }

    /**
     * Clears 2FA state
     */
    clearTwoFAState(): void {
        this.twoFactorSignInExpiry = null;
        localStorage.removeItem('twoFactorSignInExpiry');
        localStorage.removeItem('twoFactorSignInOption');
        localStorage.removeItem('twoFactorSignInUserId');
        localStorage.removeItem('jwtForAuthenticator');
        this.signInForm?.enable();
        this.signInNgForm?.resetForm();
    }
}
