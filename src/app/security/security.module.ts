import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'
import { RouterModule } from '@angular/router';
import { LockComponent } from './lock.component';
import { SecurityRoutingModule } from './security-routing.module';
import { AuthGuardService } from './auth-guard.service';

@NgModule({
  imports: [
      CommonModule,
      RouterModule,
      SecurityRoutingModule,
      FormsModule,
      ReactiveFormsModule
  ],
  declarations: [
      LockComponent
  ],
  providers: [
      AuthGuardService
  ],
})
export class SecurityModule {
}