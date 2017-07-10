import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'
//import { CustomFormsModule } from 'ng2-validation';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { CompanyComponent } from './company.component';
import { CompanySetupComponent } from './company-setup/company-setup.component';
import { CompanySetupService } from './company-setup/company-setup.service';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { UserSetupSaveCancelComponent } from './user-setup/user-setup-save-cancel.component';
import { UserSetupService } from './user-setup/user-setup.service';
import { MenuGuardService } from '../core/menu/menu-guard.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
 //   CustomFormsModule,
    ReactiveFormsModule,
    Ng2TableModule,
    PaginationModule
  ],
  declarations: [
    CompanyComponent,
    CompanySetupComponent,
    UserSetupComponent,
    UserSetupSaveCancelComponent
  ], 
  providers: [
    CompanySetupService,
    UserSetupService, 
    MenuGuardService
  ],
  exports: [
//    CustomFormsModule
  ]
})
export class CompanyModule { }
