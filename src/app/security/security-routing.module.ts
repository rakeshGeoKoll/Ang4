import { NgModule }             from '@angular/core';
import { RouterModule, Routes, Route} from '@angular/router';
import { LockComponent }    from './lock.component';

const securityRoutes: Routes = [
    { 
      path: 'lock',  
      component: LockComponent 
    },
];

@NgModule({
  imports: [
    RouterModule.forChild(securityRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class SecurityRoutingModule {
    static primaryRoute: Route = {
      path: '',
      children: securityRoutes
    }
 }