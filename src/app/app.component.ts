import { AuthStatus, SignInStatus } from './core/auth/auth-types';
import { take, takeUntil } from 'rxjs/operators';
import { AuthService } from 'app/core/auth/auth.service';
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy
{
    private _userIdle: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _timeoutId: any = null;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _authStatus: AuthStatus;
    /**
     * Constructor
     */
    constructor(private _authService: AuthService)
    {
    }


    /**
     * On init
     */
    ngOnInit(): void {

        //Auth status subscription
        this._authService.authStatus.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((authStatus: AuthStatus) => {
            this._authStatus = authStatus;
        });

        //Idle time elapsed, subscription
        this._userIdle.pipe(takeUntil(this._unsubscribeAll)).subscribe(
            () => {
                if(this._authStatus.signInStatus == SignInStatus.Authenticated
                    && this._authStatus.sessionLockEnabled) {
                        this._authService.lockSession().pipe(take(1)).subscribe(() => {
                            this.start();
                        });
                }
                
            }
        );

        //Start timer
        this.start();
    }

    /**
     * On destroy
     */
     ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Mouse or keyboard activity
     */
    @HostListener('window:keydown')
    @HostListener('window:mousemove')
    @HostListener('window:mousedown')
    @HostListener('window:click')
    @HostListener('window:touchstart')
    @HostListener('window:mousewheel')
    checkUserActivity() {
        this.reset();
        this.start();
    }

    /**
     * Start timer
     */
    start(): void {
        this._timeoutId = setTimeout(() => {
            this._userIdle.next(true);
        }, 1000 * 60 * 10); //10 minutes
    }

    /**
     * Reset timer
     */
    reset(): void {

        if(this._timeoutId) {
            clearTimeout(this._timeoutId);         //JS method
        }
       
    }
}
