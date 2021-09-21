import { AuthService } from 'app/core/auth/auth.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgModelGroup, Validators, NgForm } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { Subject } from 'rxjs';

@Component({
    selector     : 'reset-password-classic',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;
    resetSuccess: boolean = false;
    token: string = null;
    unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _authService: AuthService
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
        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
                token: ['', [Validators.required]],
                password       : ['', [Validators.required, Validators.minLength(6),
                    Validators.maxLength(64), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).*$")]],
                passwordConfirm: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64),
                    Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).*$")]]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );

        // Subscribe to query parameter map to get token value
        this._route.queryParamMap.pipe(
            takeUntil(this.unsubscribeAll)
        ).subscribe((paramsMap) => {
            this.token = paramsMap.get('token');
            const email = paramsMap.get('email');
            //Prserve the token query parameter on page refresh
            if(this.token) {
                this.resetPasswordForm.get('token').setValue(this.token);

                this._router.navigate([], {
                    queryParamsHandling: 'preserve'
                });
            }

            if(email) {
                this.resetPasswordForm.get('email').setValue(email);
            }
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {
        if(this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            return;
        }

        //Disable the form
        this.resetPasswordForm.disable();

        //Hide the alert
        this.showAlert = false;

        //Resend verification
        this._authService.resetPassword(this.resetPasswordForm.value)
            .subscribe(
                (result: any) => {
                    this.alert = {
                        type: 'success',
                        message: 'Your password has been reset successfully.'
                    };
                    this.showAlert = true;

                    //Reset the form
                    this.resetPasswordNgForm.resetForm();

                    //Enable the form
                    this.resetPasswordForm.enable();

                },
                (response) => {
                    this.alert = {
                        type: 'error',
                        message: response.error?.errMsg
                    };
                    this.showAlert = true;

                     //Reset the form
                     this.resetPasswordNgForm.resetForm();

                     //Enable the form
                     this.resetPasswordForm.enable();
                }

            
            );
        
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
