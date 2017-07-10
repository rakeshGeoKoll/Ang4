import { Injectable, EventEmitter} from '@angular/core';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { HttpModule, Http, Headers, Response, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

// Operators
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

interface IAuthService {
    IsLoggedIn : boolean;
    IsAccessTokenValid : boolean;
    IdentityClaims : any;
    IdToken: any;
    AccessToken : any;
    IsUserInRole(role: string) : boolean;
    IsUserInRoles(roles: Array<string>) : boolean;
    Login(): boolean;
    Logout(): void;
}

@Injectable()
export class AuthService implements IAuthService {

    private isLoggedIn: boolean = false;
    private userRoles: string[];
    private identityName: string;
    private authIssuer: string;
    private userInfoUrl: string;
    private isGuest: boolean;

    // set observer for roles
    rolesChangedEvent: EventEmitter<Array<string>> = new EventEmitter();

    constructor(private oAuthService: OAuthService, private http: Http, private router: Router) {
        this.authIssuer = environment.securityEndpoint;
        this.userInfoUrl = this.authIssuer + "/connect/userinfo";
        this.isLoggedIn = this.retrieveIsLoggedIn();
        this.userRoles = this.retrieveRoles();

        oAuthService.oidc = true;  //Enable OIDC
        oAuthService.issuer = this.authIssuer; // The name of the auth-server that has to be mentioned within the token
        oAuthService.clientId = environment.clientId;   // The SPA's id. Register SPA with this id at the auth-server
        oAuthService.scope = "openid profile"; //Scopes  this client is requesting TODO: the scope needs to be dynamic

        //Login and Logout Urls
        oAuthService.loginUrl = this.authIssuer + "/connect/authorize";
        oAuthService.logoutUrl = this.authIssuer + "/connect/endsession?id_token={{id_token}}&post_logout_redirect_uri=http://localhost:4200";
        oAuthService.redirectUri = window.location.origin; // URL of the SPA to redirect the user to after login 
       
        // Use setStorage to use sessionStorage or another implementation of the TS-type Storage instead of localStorage
        oAuthService.setStorage(sessionStorage);

        // This method just tries to parse the token within the url when
        // the auth-server redirects the user back to the web-app
        // It dosn't initiate the login
        if (!this.isLoggedIn) {
            this.isLoggedIn = oAuthService.tryLogin({
                onTokenReceived: context => {
                    this.isLoggedIn = true;
                    this.storeIsLoggedIn(true);
                    // context state has full URL for router navigation
                    if(context.state) {
                        console.log('AuthService:ctor context.state = ' + context.state);
                        this.router.navigate([context.state]);
                    }
                }
            });
            console.log('AuthService:ctor isLoggedIn = ' + this.isLoggedIn);
        }

        this.getUserRoles();
        console.log('AuthService:ctor userRoles = ' + this.userRoles);
    }

    // TODO: Login can be used from landing page with login button
    public Login(): boolean {
        console.log('AuthService:Login(1) urlState  = ' + urlState);
        if (this.isLoggedIn) return true;

        // urlState is relative url that oauth returns on redirection
        var urlState = (window.location.pathname.length <= 1) ? "" : window.location.pathname;
        console.log('AuthService:Login(2) urlState  = ' + urlState);
        this.oAuthService.initImplicitFlow(urlState);

        this.isLoggedIn = this.oAuthService.tryLogin( {
            onTokenReceived: context => {
                this.isLoggedIn = true;
                this.storeIsLoggedIn(true);
                console.log('AuthService:Login(3) context.state  = ' + context.state);
            }

        });

        return this.isLoggedIn;
    }

    public Logout(): void {
        console.log('AuthService:Logout(1) isLoggedIn = ' + this.isLoggedIn);
        this.isLoggedIn = false;
        this.userRoles = null;
        this.storeIsLoggedIn(false);
        this.storeRoles(null);
        localStorage.clear();
        
        this.oAuthService.logOut();
    }

    public get IsLoggedIn(): boolean {
        return this.isLoggedIn;
    }

    public get IsAccessTokenValid(): boolean {
        return this.oAuthService.hasValidAccessToken();
    }

    public get IdentityClaims(): any {
        var x = this.oAuthService.getIdentityClaims();
        return x;
    }

    public get AccessToken(): any {
        return this.oAuthService.getAccessToken();
    }

    public get IdToken(): any {
        return this.oAuthService.getIdToken();
    }

    public IsUserInRoles(roles: Array<string>): boolean {
        console.log('AuthService:IsUserInRoles(1)this.userRoles = ' + roles);
        let retval = false;
        if (this.userRoles == null || roles == null) return retval;
        for (let role of roles) {
            if (this.IsUserInRole(role)) {
                console.log('AuthService:IsUserInRoles(2) userRole = ' + role);
                retval = true;
                break;
            }
        }
        return retval;
    }

    public IsUserInRole(role: string): boolean {
        console.log('AuthService:IsUserInRole(1) this.userRoles = ' + this.userRoles);
        let retval = false;
        if (this.userRoles == null) return retval;
        for (let userRole of this.userRoles) {

            if (role == userRole)
            {            
                console.log('AuthService:IsUserInRole(2) userRole = ' + userRole);
                retval = true;
                break;
            }
        }
        return retval;
    }

    private storeIsLoggedIn(value:boolean) {
        localStorage.setItem("loggedIn", JSON.stringify(value));
    }

    private retrieveIsLoggedIn():boolean {
        var retval = (!localStorage.getItem("loggedIn")) ? false : true;
        return retval;
    }

    private storeRoles(value:string[]) {
        localStorage.setItem("userRoles", JSON.stringify(value));
    }

    private retrieveRoles():string[] {
        return JSON.parse(localStorage.getItem("userRoles"));
    }

    private getUserRoles(): void {
        console.log('AuthService:getUserRoles(1) this.isLoggedIn = ' + this.isLoggedIn);
        if (!this.isLoggedIn) return;

        console.log(this.userRoles);

        var search = new URLSearchParams();
        search.set('token', this.oAuthService.getIdToken());
        search.set('client_id', this.oAuthService.clientId);

        this.http.get(this.userInfoUrl, { search } )
            .map((res: Response) => res.json())
            .subscribe((result) => {
            if (result["Role"]) {
                var roleObject = result["Role"];
                if (roleObject.constructor === Array) {
                    this.userRoles = roleObject;
                } else {
                    this.userRoles = [result["Role"]];
                }
                console.log(this.userRoles);
                this.storeRoles(this.userRoles);
                this.rolesChangedEvent.emit(this.userRoles);
            }

            });
    }

    private getIdentityName(): void {
        console.log('AuthService:getIdentityName(1)');
        if (!this.isLoggedIn) return;

        var search = new URLSearchParams();
        search.set('token', this.oAuthService.getIdToken());
        search.set('client_id', this.oAuthService.clientId);
        this.http.get(this.userInfoUrl, { search })
            .map((res: Response) => res.json())
            .subscribe((result) => {
                if (result["name"]) {
                    this.identityName = result["Name"];
                }
            });
    }

    private getLoginInfo (): Observable<any> {
        console.log('AuthService:getLoginInfo(1)');
        if (!this.isLoggedIn) return;

        var search = new URLSearchParams();
        search.set('token', this.oAuthService.getIdToken());
        search.set('client_id', this.oAuthService.clientId);
        return this.http.get(this.userInfoUrl, { search })
                                .map(this.extractData)
                                .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.data || { };
    }

    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
        errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}