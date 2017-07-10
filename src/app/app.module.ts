import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { ShellModule } from './shell/shell.module';
import { SecurityModule } from './security/security.module';
import { SharedModule } from './shared/shared.module';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { AuthService } from './security/auth.service';

import { Http} from '@angular/http';
import { ExtendedHttpService } from './security/extended-http.service';

import { UsersComponent } from './users/users.component';
import { UserRoleComponent } from "./user-role/user-role.component";
import { UserRoleService } from "./user-role/user-role.service";

@NgModule({
    declarations: [
        AppComponent,          
        UsersComponent,
        UserRoleComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        CoreModule,
        ShellModule,
        SecurityModule,
        SharedModule        
    ],
    providers: [
        OAuthService, 
        AuthService,
        { provide: Http, useClass: ExtendedHttpService },
        UserRoleService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
    constructor() {
        console.log('AppModule:ctor');
    }
}