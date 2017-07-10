import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route} from '@angular/router';
import { CompanySetupComponent } from './company-setup/company-setup.component';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { MenuGuardService } from '../core/menu/menu-guard.service';

const companyRoutes: Routes = [
  {
    path: 'company-setup',
    component: CompanySetupComponent,
    canActivate: [MenuGuardService],
  },
  {
    path: 'user-setup',
    component: UserSetupComponent,
    canActivate: [MenuGuardService],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(companyRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [ 
    MenuGuardService
  ]
})

export class CompanyRoutingModule { 
  static primaryRoute: Route = {
    path: 'company',
    children: companyRoutes
  }
}