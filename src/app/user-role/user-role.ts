export interface IUserRole{
Id:number;
UserName:string;
RoleName:string;
RoleList:any;
}
export class UserRole implements IUserRole{
    Id: number;
    UserName: string;
    RoleName: string;
    RoleList:any;

}

export interface IRoles{
    id:string;
    name:string;
}