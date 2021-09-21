import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class IdPictureInputErrorMatcher implements ErrorStateMatcher{
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!((control?.hasError('notAllowed') || control?.hasError('required') || control?.hasError('fileSizeLimitExceeded')) && (control?.dirty ||  control?.touched || isSubmitted));
    }
}

export class DocumentFileInputErrorMatcher implements ErrorStateMatcher{
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!((control?.hasError('notAllowed') || control?.hasError('required') || control?.hasError('fileSizeLimitExceeded')) && (control?.dirty || control?.touched || isSubmitted));
    }
}