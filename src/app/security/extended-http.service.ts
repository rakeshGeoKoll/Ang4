import { Injectable } from '@angular/core';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ExtendedHttpService extends Http {

    constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router, private oAuthService: OAuthService) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        if (typeof url === 'string') {
            if (!options) {
                options = { headers: new Headers() };
            }
            this.setHeaders(options);
        } else {
            this.setHeaders(url);
        }

        return super.request(url, options).catch(this.catchErrors());
    }

    public isAccessExpired():boolean {
        return this.oAuthService.hasValidAccessToken();
    }

    private catchErrors() {
        return (res: Response) => {
            if (res.status === 401) {
                localStorage.clear();
                this.oAuthService.logOut();
            }
            return Observable.throw(res);
        };
    }

    private setHeaders(objectToSetHeadersTo: Request | RequestOptionsArgs) {
        let token = this.oAuthService.getAccessToken();
        objectToSetHeadersTo.headers.set('Authorization', 'Bearer ' + token);
    }
}

