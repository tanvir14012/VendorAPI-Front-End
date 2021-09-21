import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AccountStatus } from 'app/core/auth/auth-types';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string, validationMessages?: null } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    lastEmail: string = null;

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
            email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64),
                 Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).*$")]],
            rememberMe: [false, []]
        });
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

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
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

                    else if(signinResult.TwoFactorToken) {

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
}
