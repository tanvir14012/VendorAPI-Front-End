import { fuseAnimations } from '@fuse/animations';
import { FormGroup, NgForm, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'auth-resend-email-verification',
  templateUrl: './resend-email-verification.component.html',
  animations: fuseAnimations
})
export class ResendEmailVerificationComponent implements OnInit, OnDestroy {
  @ViewChild('resendEmailNgForm') resendEmailNgForm: NgForm;
  resendEmailForm: FormGroup;
  alert: { type: FuseAlertType; message: string} = {
      type: 'success',
      message: ''
  };
  showAlert: boolean = false;
  email: string = null;
  emailSentSuccess: boolean = true;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * Constructor
   */
  constructor(
      private _route: ActivatedRoute,
      private _fb: FormBuilder,
      private _authService: AuthService)
  {
  }

  /**
   * On init
   */
  ngOnInit() {

      this.resendEmailForm = this._fb.group({
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]]
      });

      //Subscribe to route params
      this._route.queryParamMap.pipe(takeUntil(this._unsubscribeAll)).subscribe((paramsMap) => {
          const email = paramsMap.get('email');
          if(email) {
              this.resendEmailForm.get('email').setValue(email);
          }
      });
  }

    /**
     * On destroy
     */
   ngOnDestroy(): void
   {
       // Unsubscribe from all subscriptions
       this._unsubscribeAll.next();
       this._unsubscribeAll.complete();
   }

   /**
    * Resend
    */
    resendVerification(): void {
        if(this.resendEmailForm.invalid) {
            this.resendEmailForm.markAllAsTouched();
            return;
        }

        //Disable the form
        this.resendEmailForm.disable();

        //Hide the alert
        this.showAlert = false;

        //Resend verification
        this._authService.resendEmailVerification(this.resendEmailForm.value)
        .subscribe(
            (result: any) => {
                this.alert = {
                    type: 'success',
                    message: 'An email with instructions has been resent to your email address.'
                };
                this.showAlert = true;

                //Reset the form
                this.resendEmailNgForm.resetForm();

                //Enable the form
                 this.resendEmailForm.enable();

            },
            (response) => {
                this.alert = {
                    type: 'error',
                    message: response.error?.errMsg
                };
                this.showAlert = true;

                //Reset the form
                this.resendEmailNgForm.resetForm();

                //Enable the form
                this.resendEmailForm.enable();
            }

           
        );

    }

}
