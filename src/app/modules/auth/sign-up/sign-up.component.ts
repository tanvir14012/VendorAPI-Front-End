import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { Country, countries} from './sign-up-types-data';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    countryList: Country[] = countries;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
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
        this.signUpForm = this._formBuilder.group({
                firstName      : ['', [Validators.required, Validators.maxLength(25), 
                    Validators.pattern("^(?<firstchar>(?=[A-Za-z]))((?<alphachars>[A-Za-z])|(?<specialchars>[A-Za-z]['-](?=[A-Za-z]))|(?<spaces> (?=[A-Za-z])))*$")]],
                lastName      : ['', [Validators.required, Validators.maxLength(25), 
                    Validators.pattern("(?<firstchar>(?=[A-Za-z]))((?<alphachars>[A-Za-z])|(?<specialchars>[A-Za-z]['-](?=[A-Za-z]))|(?<spaces> (?=[A-Za-z])))*")]],
                email     : ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
                phoneNumber: this._formBuilder.group({
                    country: ['us', [Validators.required]],
                    number: ['', [Validators.pattern("^[0-9]{9,14}$"), Validators.required]]
                }),
                password  : ['', [Validators.required, Validators.minLength(6), 
                    Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).*$")]],
                passwordConfirm  : ['', [Validators.required]],
                company   : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
                businessModel: ['1', Validators.required],
                agreements: ['', Validators.requiredTrue]
            },
            {
                validators: [FuseValidators.mustMatch('password', 'passwordConfirm')]
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        // Do nothing if the form is invalid
        if ( this.signUpForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign up
        this._authService.signUp(this.signUpForm.value)
            .subscribe(
                (response) => {

                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/confirmation-required');
                },
                (response) => {

                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    this.signUpNgForm.resetForm();

                    // Set default phone number prefix
                    this.signUpForm.get('phoneNumber').get('country').setValue('us');
                    // Set default business model
                    this.signUpForm.get('businessModel').setValue('1');

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: response.error ? response.error.errMsg : 'Something went wrong, please try again'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );
    }

    /**
     * Get country info by iso code
     *
     * @param iso
     */
     getCountryByIso(iso: string): Country
     {
         return countries.find(country => country.iso === iso);
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
}
