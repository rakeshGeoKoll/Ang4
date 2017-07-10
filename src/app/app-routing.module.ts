import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { Location, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PreloadSelectedModules } from './selective-preload-strategy';
import { ShellRoutingModule } from './shell/shell-routing.module';
import {UserSetupComponent} from './company/user-setup/user-setup.component'
import { UserRoleComponent } from "./user-role/user-role.component";
const appRoutes: Routes = [
  
  {
    path:"users",
    component: UserSetupComponent
  },
  {
    path:"user/:id",
    component:UserRoleComponent
  },
  {
    path: '**',
    redirectTo: 'login',

  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {useHash: false}),
    ShellRoutingModule,
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { 
}
