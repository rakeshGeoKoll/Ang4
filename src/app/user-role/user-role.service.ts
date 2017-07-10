
import { Injectable } from "@angular/core";
import { IUserRole, UserRole, IRoles } from "./user-role";
import {Http,  Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserRoleService {
    private _userRoleServiceUrl='http://localhost:5000/api/Roles/';
     private headers: Headers;
    constructor(private _http:Http)
    {

    }
     private setHeaders() {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');

        // let token = this._securityService.getToken();
        // if (token !== '') {
        //     let tokenValue = 'Bearer ' + token;
        //     this.headers.append('Authorization', tokenValue);
        // }
    }
    
    public handleError(error:any) {
        console.log("Error");
        
    }
    public getUserName=(id:string):Observable<any>=>
    {
        console.log("GetUserName" );
         this.setHeaders();
         
        return this._http.get("http://localhost:5000/api/Users/"+id,{headers:this.headers,body:''}).map(res=>res.json());         

    }
    public Update=(id:string, itemToUpdate:any):Observable<Response>=>{
       
        console.log("Update "+JSON.stringify(itemToUpdate));
        this.setHeaders();
      
         return this._http.post(this._userRoleServiceUrl+id+'/Roles'
            ,JSON.stringify(itemToUpdate)
            ,{ headers: this.headers });
    }
   public getRoles =():Observable<IRoles[]>=>
    {
        this.setHeaders();

        return this._http.get(this._userRoleServiceUrl,{headers:this.headers,body:''}).map(res=>res.json());
    }

   public getRolesOfUser=(id:string):Observable<any>=>
   {
        this.setHeaders();
        return this._http.get(this._userRoleServiceUrl+id+"/Roles",{headers:this.headers,body:''}).map(res=>res.json());
    }
    
    


}