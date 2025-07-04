import { AuthStatus } from './../../../core/auth/auth-types';
import { UserProfile } from './../../../core/user-profile/user-profile.types';
import { UserProfileService } from 'app/core/user-profile/user-profile.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector       : 'user',
    templateUrl    : './user.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs       : 'user'
})
export class UserComponent implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;
    userProfile: UserProfile;
    authStatus: AuthStatus;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userProfileService: UserProfileService,
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
        // Subscribe to user changes
        this._userProfileService.userProfile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((userProfile: UserProfile) => {
                this.userProfile = userProfile;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        
        // Subscribe to the auth status
        this._authService.authStatus.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((authStatus: AuthStatus) => {
            this.authStatus = authStatus;
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    // updateUserStatus(status: string): void
    // {
    //     // Return if user is not available
    //     if ( !this.user )
    //     {
    //         return;
    //     }

    //     // Update the user
    //     this._userService.update({
    //         ...this.user,
    //         status
    //     }).subscribe();
    // }

    /**
     * Sign out
     */
    signOut(): void
    {
        this._router.navigate(['/sign-out']);
    }
}
