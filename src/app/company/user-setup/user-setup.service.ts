import { Injectable } from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { Observable }     from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpModule, Http, Headers, Response} from '@angular/http';
import { UserSetupModel } from './user-setup-model';
import { UserSetupOptionsModel } from './user-setup-options-model';
import { UserSetupMockData } from './user-setup-mock-data';
import { UserSetupAccessLevelMockData } from './user-setup-mock-data';
//import { UserSetupCompanyMockData } from './user-setup-mock-data';
import { CompanySetupModel } from '../company-setup/company-setup-model';
import { UserSetupRolesModel } from './user-setup-roles-model';

interface IUserSetupService {
    getUsers(): Observable<UserSetupModel[]>;
    postUser(model: UserSetupModel); //: Observable<Response>;
    putUser(model: UserSetupModel); //: Observable<Response>;
    getAccessLevels(): Observable<UserSetupRolesModel[]>;
//    getCompanies(): Observable<CompanySetupModel[]>;
    canAddUser: boolean;
    isCompanyManager: boolean;
}

@Injectable()
export class UserSetupService implements IUserSetupService {
    private useMock: boolean = false;
    private static readonly getUrl: string = environment.securityEndpoint + '/api/users';
    private static readonly getCompanyUrl: string = environment.securityEndpoint + '/api/company';
    private static readonly getRoleUrl: string = environment.securityEndpoint + '/api/roles';
    private static readonly postUrl: string = environment.securityEndpoint + '/api/users';
    private static readonly putUrl: string = environment.securityEndpoint + '/api/users';
    private data: Array<UserSetupModel>;
    private roles: Array<string> = [];
    private identityName: string;

    constructor(private http: Http, private authService: AuthService) {
        console.log('UserSetupService:ctor');
    }

    public getUsers(): Observable<UserSetupModel[]> {
        return (this.useMock) ? this.getUsersMockObservable() : this.getUsersApiObservable();
    }

    public postUser(model: UserSetupModel): Observable<Response> {
        var endpoint = UserSetupService.postUrl;
        console.log('UserSetupService:postUser endpoint = ' + endpoint);
        return this.http.post(endpoint, model).catch(this.handlePostError);
    }

    public putUser(model: UserSetupModel): Observable<Response> {
        var endpoint = UserSetupService.putUrl + '/' + model.userId;
        console.log('UserSetupService:putUser endpoint = ' + endpoint);
        return this.http.put(endpoint, model).catch(this.handlePutError);
    }

    public get canAddUser(): boolean {
        return (this.isCompanyManager);
    }
    
    public get isCompanyManager(): boolean {
        if (this.roles.length == 0) this.loadRoles();
        return this.FindRole("UserManager");
    }
    
    public getAccessLevels(): Observable<UserSetupRolesModel[]> {
        return (this.useMock) ? this.getAccessLevelsMockObservable() : this.getAccessLevelsApiObservable();
    }

//    public getCompanies(): Observable<CompanySetupModel[]> {
//        return (this.useMock) ? this.getCompaniesMockObservable() : this.getCompaniesApiObservable();
//    }

//    public getStores(): Observable<StoreSetupModel[]> {
//        return (this.useMock) ? this.getStoresMockObservable() : this.getStoresApiObservable();
//    }

    private FindRole(roleToFind:string): boolean {
        for (let role of this.roles) {
            if (role == roleToFind) return true;
        }
        return false;
    }

    private loadRoles(): void {

        if (this.authService.IsUserInRole('UserManager')) this.roles.push('UserManager');
        if (this.authService.IsUserInRole('Guest')) this.roles.push('Guest');

        // TODO: remove when webapi is enabled.
        if (this.roles.length == 0) this.roles.push('UserManager');
    }

    private getUsersMockObservable (): Observable<UserSetupModel[]> {
        console.log('UserSetupService:getUsersMockObservable...');
        return Observable.of(UserSetupMockData).map(o => o);
    }

    private getUsersApiObservable (): Observable<UserSetupModel[]> {
        console.log('UserSetupService:getUsersApiObservable...');
        return this.http.get(UserSetupService.getUrl)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    private getAccessLevelsMockObservable(): Observable<UserSetupRolesModel[]>{
        console.log('UserSetupService:getAccessLevelsMockObservable...');
        return Observable.of(UserSetupAccessLevelMockData).map(o => o);
    }

    private getAccessLevelsApiObservable (): Observable<UserSetupRolesModel[]> {
        console.log('UserSetupService:getAccessLevelsApiObservable...');
        return this.http.get(UserSetupService.getRoleUrl)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    //private getCompaniesMockObservable(): Observable<CompanySetupModel[]>{
    //    console.log('UserSetupService:getCompaniesMockObservable...');
    //    return Observable.of(UserSetupCompanyMockData).map(o => o);
    //}

    private getCompaniesApiObservable (): Observable<CompanySetupModel[]> {
        console.log('UserSetupService:getCompaniesApiObservable...');
        return this.http.get(UserSetupService.getCompanyUrl)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    private extractData(res: Response) {
        console.log('UserSetupService:extractData...');
        let body = res.json();
        return body || { };
    }

    private handleError (error: Response | any) {
        console.log('UserSetupService:handlePostError...');
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

    private handlePostError (error: Response | any) {
        console.log('UserSetupService:handlePostError...');
        return Observable.throw("The username already exists.");
    }     

    private handlePutError (error: Response | any) {
        console.log('UserSetupService:handlePutError...');
        return Observable.throw("The changes cannot be saved.");
    }                 
}