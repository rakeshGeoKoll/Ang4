import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyRoutingModule } from '../company/company-routing.module';
import { SecurityRoutingModule } from '../security/security-routing.module';
import { PreloadSelectedModules } from '../selective-preload-strategy';

import { ShellComponent }    from './shell.component';
import { HomeComponent } from './home/home.component'

import { CompanyMenuService } from '../company/company-menu.service';
import { HomeMenuService } from './home/home-menu.service';
import { MenuService } from '../core/menu/menu.service';
import { CanDeactivateGuardService } from '../security/can-deactivate-guard.service';
import { AuthGuardService } from '../security/auth-guard.service';

const shellRoutes: Routes = [
  {
    path: '',
    component: ShellComponent,
    // Note: deactivate guard when identity server api is not needed (e.g. for development)
    canActivate: [AuthGuardService], // AuthGuardService redirects to identity server login if gaurd returns false
    children: [
      {
          path: '',
          component: HomeComponent,
      },
      CompanyRoutingModule.primaryRoute,
      SecurityRoutingModule.primaryRoute
    ],
    
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(shellRoutes),
    CompanyRoutingModule,
    SecurityRoutingModule
  ],
  exports: [
    RouterModule,
  ],
  providers: [
    CanDeactivateGuardService,
    PreloadSelectedModules,
    CompanyMenuService, 
    HomeMenuService
  ]
})

export class ShellRoutingModule {
  // TODO: inject menus with services encapsulated in modules
  constructor(private menu: HomeMenuService, private menu1: CompanyMenuService) {
  }
}