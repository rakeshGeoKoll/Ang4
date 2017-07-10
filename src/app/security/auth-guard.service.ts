import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {
  
    constructor(protected authService: AuthService, protected router: Router) {
      console.log('AuthGuardService:ctor');
    }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    console.log('AuthGuardService:canActivate(1) url = ' + url);
    var retval = this.checkLogin(url);
    console.log('AuthGuardService:canActivate(2) retval = ' + retval);
    return retval;
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('AuthGuardService:canActivateChild route = ' + route + '; state = ' + state);
    return this.canActivate(route, state);
  }

  public canLoad(route: Route): boolean {
    let url = `/${route.path}`;
    console.log('AuthGuardService:canLoad url = ' + url);
    return this.checkLogin(url);
  }
  
  private checkLogin(url: string): boolean {
      console.log('AuthGuardService:checkLogin(1) isLogedIn = ' + this.authService.IsLoggedIn);
      if (this.authService.IsLoggedIn) return true;
      
      console.log('AuthGuardService:checkLogin(2) login...');
      var retval = this.authService.Login();
      console.log('AuthGuardService:checkLogin(3) retval = ' + retval);
      return retval;
  }
}
