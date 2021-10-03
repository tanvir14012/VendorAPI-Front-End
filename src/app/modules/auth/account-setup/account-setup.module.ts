import { FuseAlertModule } from './../../../../@fuse/components/alert/alert.module';
import { FuseCardModule } from '@fuse/components/card';
import { AccountSetupComponent } from './account-setup.component';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from 'app/shared/shared.module';
import {MatListModule} from '@angular/material/list';

export const routes: Route[] = [
    {
        path     : '',
        component: AccountSetupComponent
    }
];

@NgModule({
    declarations: [
        AccountSetupComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatStepperModule,
        SharedModule,
        MatListModule,
        FuseCardModule,
        FuseAlertModule
    ]
})
export class AccountSetupModule
{
}
