import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {UserRoleService} from './user-role.service';
import { UserRole, IRoles } from "./user-role";
import { Role } from "./role.component";
@Component(
    {
       templateUrl:'./user-role.component.html'     
    }
)
export class UserRoleComponent implements OnInit{
    UserRole: any;
    private userId:string;
    pageTitle: string = "User Role Assign"
    message :string ="";
    drpRoles:IRoles[];  
   
    
    ngOnInit(): void {     
        let id = this._route.snapshot.params['id'];
        this.message += `:${id}`;  
        console.log(id);   
       
         this.UserRole = { userId: id, userName:''};
         this.userId=id;  
  
    //  this.sub = this._route.params.subscribe(params => {
    //     let id = params['id'];        
    //     this._userRoleService.getUserName(id).subscribe(data=>{
    //         console.log(data);
    //     }   
           
    //     ); 

    //     });  
            this._userRoleService.getUserName(id).subscribe(data=>{
            console.log(data.userName);
           this.UserRole.UserName=data.userName;
        });
       this.getRolesOfUser(id);
    }
    

constructor(private _route :ActivatedRoute, private _userRoleService: UserRoleService,
  private _router: Router)
{ 
    this._userRoleService.getRoles().subscribe(drpRoles=>{
       // console.log(drpRoles);
         this.drpRoles=drpRoles;
        }
    );
    

}

public Update(value)  {
   console.log(value);
   this.UserRole.RoleId=value;
    this._userRoleService.Update(this.userId, this.UserRole)
            .subscribe((()=>console.log("Update")),    
                 error=>this._userRoleService.handleError(error),
                ()=> this._router.navigate([''])   )
    }


    public getRolesOfUser(id)  
    {
        console.log("XX");
        this._userRoleService.getRolesOfUser(id).
     subscribe(data=>{
         console.log(data);
     });
    }
}

