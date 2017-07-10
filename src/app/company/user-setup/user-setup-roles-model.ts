interface IUserSetupRolesModel {
  active: boolean;
  description: string;
  roleId: number;
  name: string;
}

export class UserSetupRolesModel implements IUserSetupRolesModel {
  active: boolean;
  description: string;
  roleId: number;
  name: string;
}