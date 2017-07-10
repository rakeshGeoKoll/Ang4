import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpModule, Http, Headers, Response} from '@angular/http';
import { CompanySetupModel } from './company-setup-model';
import { CompanySetupMockData } from './company-setup-mock-companies';
import { CompanySetupFeatureModel } from './company-setup-feature-model';
import { CompanySetupFeatureMockData } from './company-setup-mock-features';
import { Observable }     from 'rxjs/Observable';

interface ICompanySetupService {
    getCompanies(): Observable<CompanySetupModel[]>;
    getFeatures(): Observable<CompanySetupFeatureModel[]>;
    putCompany(model: CompanySetupModel): void;
}

@Injectable()
export class CompanySetupService {
    private getUrl: string = environment.securityEndpoint + '/api/company';
    private getFeatureUrl: string = environment.securityEndpoint + '/api/feature';
    private putUrl: string = environment.securityEndpoint + '/api/company';
    private postUrl: string = environment.securityEndpoint + '/api/company';
    //private data: Array<CompanySetupModel>;

    private useMock: boolean = false;

    constructor(private http: Http) {
        console.log('CompanySetupService:ctor');
    }

    public getCompanies(): Observable<CompanySetupModel[]> {
        return (this.useMock) ? this.getCompaniesMockObservable() : this.getCompaniesApiObservable();
    }

    public getFeatures(): Observable<CompanySetupFeatureModel[]> {
        return (this.useMock) ? this.getFeaturesMockObservable() : this.getFeaturesApiObservable();
    }

    private getCompaniesMockObservable(): Observable<CompanySetupModel[]> {
        console.log('CompanySetupService:getCompaniesMockObservable...');
        return Observable.of(CompanySetupMockData).map(o => o);
    }

    private getCompaniesApiObservable(): Observable<CompanySetupModel[]> {
        console.log('CompanySetupService:getCompaniesApiObservable...');
        //return null;
        return this.http.get(this.getUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private getFeaturesMockObservable(): Observable<CompanySetupFeatureModel[]> {
        console.log('CompanySetupService:getFeaturesMockObservable...');
        return Observable.of(CompanySetupFeatureMockData).map(o => o);
    }

    private getFeaturesApiObservable(): Observable<CompanySetupFeatureModel[]> {
        console.log('CompanySetupService:getFeaturesApiObservable...');
        return this.http.get(this.getFeatureUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        console.log('CompanySetupService:extractData...');
        let body = res.json();
        return body || {};
    }

    public putCompany(model: CompanySetupModel) {
        var endpoint = this.putUrl + '/' + model.companyId;
        console.log('CompanySetupService:putCompany endpoint = ' + endpoint);
        console.log(model);
        return this.http.put(endpoint, model).catch(this.handleError);
    }
    public postCompany(model: CompanySetupModel) {
        var endpoint = this.postUrl;
        console.log('CompanySetupService:postCompany endpoint = ' + endpoint);
        console.log(model);
        return this.http.post(endpoint, model).catch(this.handleError);
    }

    private handleError(error: Response | any) {
        console.log('CompanySetupService:handleError...');
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