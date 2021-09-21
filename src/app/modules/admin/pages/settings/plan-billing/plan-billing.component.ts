import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, countries } from '../settings.types';

@Component({
    selector       : 'settings-plan-billing',
    templateUrl    : './plan-billing.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPlanBillingComponent implements OnInit
{
    planBillingForm: FormGroup;
    plans: any[];
    countryList: Country[] = countries;
    phonePrefix: string = '+1';
    yearlyBilling: boolean = true;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
      * 
      * Plan and billing form submit
      */
     onPlanAndBillingSubmit(): void {
        if(this.planBillingForm.valid) {
            
        }
        console.log(this.planBillingForm);
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
     * Country select change event handler
     */
    countryChange(country: Country): void {
            this.phonePrefix = country.code;
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
