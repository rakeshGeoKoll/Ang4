import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../security/auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    private isGuest: boolean = false;
    private isUserManager: boolean = false;
    private username: string;


    
    private welcomeMessage: string;


    private readonly defaultMessage: string = 'Click on any navigation menu to proceed.';

    constructor(private authService: AuthService) { 
        console.log('HomeComponent:ctor');

        // update observer with new roles
        authService.rolesChangedEvent.subscribe((newRoles) => {
            for(var role of newRoles)
            {
                switch(role) {
                    case 'UserManager': this.isUserManager = true; this.username = 'Manager'; this.welcomeMessage = "Select menu for your operation"; break;
                    default: this.isGuest = true; this.username = 'Guest'; this.welcomeMessage = this.defaultMessage;
                }
            };
        });
    }

    ngOnInit() {

        if (this.authService.IsUserInRole('Guest')) {
            this.isGuest = true;
            this.username = 'Guest';
            this.welcomeMessage = this.defaultMessage;
        }

        console.log('HomeComponent:ngOnInit isGuest = ' + this.isGuest + '; isUserManager = ' + this.isUserManager);
    }
}
