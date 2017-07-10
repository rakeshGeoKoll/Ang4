import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route } from '@angular/router';
import { AuthService } from '../../security/auth.service';
import { AuthGuardService } from '../../security/auth-guard.service';
import { MenuService, IMenu, ISubMenu } from './menu.service';

@Injectable()
export class MenuGuardService extends AuthGuardService {

  constructor(protected authService: AuthService, protected router: Router, private menuService: MenuService) {
    super(authService, router);
    console.log('MenuGuardService:ctor');
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('MenuGuardService:canActivate route = ' + route + '; state = ' + state);
    return this.menuService.IsMenuAllowed(state.url);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('MenuGuardService:canActivateChild route = ' + route + '; state = ' + state);
    if (route.params['id']) {
          console.log('MenuGuardService:canActivateChild route.params[id] = ' + route.params['id']);
    }
    return true; //this.canActivate(route, state);
  }
}
