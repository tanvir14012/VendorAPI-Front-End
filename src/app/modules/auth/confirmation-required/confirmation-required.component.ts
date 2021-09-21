import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { Subject } from 'rxjs';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationRequiredComponent
{
    verificationMode = false;
    emailVerfReqInProgress: boolean = false;
    emailVerified: boolean = false;
    alert: { type: FuseAlertType; message: string} = {
        type: 'success',
        message: ''
    };
    showAlert: boolean = false;
    email: string = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _route: ActivatedRoute,
        private _authService: AuthService)
    {
    }

    ngOnInit() {
        this._route.queryParamMap.pipe(takeUntil(this._unsubscribeAll)).subscribe((paramsMap) => {
            const email = paramsMap.get('email');
            const token = paramsMap.get('token');
            if(email && token) {
                this.verificationMode = true;
                this.emailVerfReqInProgress = true;
                this.email = email;
                this.showAlert = false;
                
                this._authService.confirmEmail({email: email, token: token}).subscribe((success: boolean) => {
                    this.emailVerfReqInProgress = false;
                    this.emailVerified = success;
                    if(success) {
                        this.alert.type = 'success';
                        this.alert.message = 'Your email address has been verified. You can now log in.'
                    }
                    else {
                        this.alert.type = 'error';
                        this.alert.message = 'Email address verification failed. The link is either expired or invalid.'
                    }
                    this.showAlert = true;
                });
            }
            else {
                this.verificationMode = false;
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
}
