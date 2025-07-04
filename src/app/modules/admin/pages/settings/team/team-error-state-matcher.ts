import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CountryAndPhonePrefixErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
        const formSubmitted = form.submitted;
        return !!((form.hasError('phonePrefixAndCountryMismatch') || control.hasError('required')
         || control.hasError('maxlength') || control.hasError('minlength') || control.hasError('pattern')) && 
         (control?.dirty || control?.touched || formSubmitted));
    }
}

export class PasswordCheckErrorMatcher implements ErrorStateMatcher{
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(form?.hasError('mismatch') && (control?.dirty || control?.touched || isSubmitted));
    }
}