import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { ResendEmailVerificationComponent } from './resend-email-verification.component';
import { authResendEmailVerificationRoutes } from './resend-email-verification.routing';
import { MatFormFieldModule } from '@angular/material/form-field';




@NgModule({
  declarations: [
    ResendEmailVerificationComponent
  ],

  imports: [
    RouterModule.forChild(authResendEmailVerificationRoutes),
        MatButtonModule,
        FuseCardModule,
        SharedModule,
        FuseAlertModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule
  ]
})
export class ResendEmailVerificationModule { }
