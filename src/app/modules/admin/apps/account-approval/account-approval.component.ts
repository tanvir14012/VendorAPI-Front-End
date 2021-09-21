import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'account-approval',
    templateUrl    : './account-approval.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountApprovalComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
