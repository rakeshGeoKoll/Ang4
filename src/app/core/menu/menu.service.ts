import { Injectable, EventEmitter } from '@angular/core';
import { AuthService } from '../../security/auth.service';

export interface IMenu {
    text: string;
    automationId: string;
    heading?: boolean;
    link?: string;
    icon?: string;
    alert?: string;
    role?: Array<string>;
    submenu?: Array<ISubMenu>;
}

export interface ISubMenu {
    text: string;
    automationId: string;
    link?: string;
    role?: Array<string>;
}

@Injectable()
export class MenuService {
    allMenuItems: Array<IMenu>;
    menuItems: Array<IMenu>;
    // set observer for setting roles
    menuChanged: EventEmitter<Array<IMenu>> = new EventEmitter();

    constructor(private authService: AuthService) {
        this.menuItems = [];
        this.allMenuItems = [];

        authService.rolesChangedEvent.subscribe((newRoles) => {
            this.setRoles(newRoles);
        });
    }

    public addMenu(items: Array<IMenu>) {
        items.forEach((item) => {
            this.allMenuItems.push(item);
        });
    }

    public getMenu(): IMenu[] {
        return this.menuItems;
    }

    public IsMenuAllowed(route: string): boolean {
        let retval = false;
        if (route == null) return retval;
        
        for (let menuItem of this.allMenuItems) {
            if (menuItem.link == route && this.authService.IsUserInRoles(menuItem.role)) {
                retval = true;
                break;
            }
            
            if (menuItem.submenu && menuItem.submenu.length > 0) {
                for (let submenuItem of menuItem.submenu) {
                    if (submenuItem.link == route && this.authService.IsUserInRoles(submenuItem.role)) {
                        retval = true;
                        break;
                    }  
                }
                if (retval) break;
            }
        }
        return retval;
    }

    private setRoles(roles: Array<string>) {
        this.menuItems = [];
        
        this.allMenuItems.forEach((menuItem) => {
            if (menuItem.submenu && menuItem.submenu.length > 0) {
                var authorizedSubMenus = [];

                menuItem.submenu.forEach((subMenuItem) => {
                    if (subMenuItem.role) {
                        subMenuItem.role.forEach((menuRole) => {
                            if (roles.indexOf(menuRole) > -1) {
                                authorizedSubMenus.push(subMenuItem);
                            }  
                        });
                    } else {
                        authorizedSubMenus.push(subMenuItem);
                    }
                });
                menuItem.submenu = authorizedSubMenus;
                if (menuItem.submenu.length > 0) {
                    this.menuItems.push(menuItem);
                }
            } else {
                this.menuItems.push(menuItem);
            }
        });

        this.menuChanged.emit(this.menuItems);
    }
}
