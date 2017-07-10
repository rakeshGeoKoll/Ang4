import { Injectable } from '@angular/core';
import { MenuService } from '../core/menu/menu.service';

@Injectable()
export class CompanyMenuService {

   companyMenu = {
       text: 'Company',
       link: '/company',
       icon: 'icon-home',
       role: ['UserManager', 'Guest'],
       automationId: 'shellCompanyMenuItem',
       submenu: [
            {
                text: 'Company Setup',
                link: '/company/company-setup',
                role: ['UserManager', 'Guest'],
                automationId: 'shellCompanyMenuItemCompanySetup'
            },
            {
                text: 'User Setup',
                link: '/company/user-setup',
                role: ['UserManager', 'Guest'],
                automationId: 'shellCompanyMenuItemUserSetup'
            },
       ]
   };

    constructor(private menu: MenuService) {
        menu.addMenu([this.companyMenu]);   
   }
}