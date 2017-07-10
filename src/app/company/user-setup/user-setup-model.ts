interface IUserSetupModel {
  active: boolean;
  companyId: number;
  companyName: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  userId: number;
  username: string;
  password: string;
  roles: Array<string>;

  displayActive: string;
  displayRoles: string;
}

export class UserSetupModel implements IUserSetupModel {
  active: boolean;
  companyId: number;
  companyName: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  userId: number;
  username: string;
  password: string;
  roles: Array<string>;

  public get displayActive(): string {
    return this.active ? 'Active' : 'Inactive';
  }

  public get displayRoles(): string {
    let roleDisplay: string = '';
    this.roles.forEach((role: string) => {
        console.log('UserSetupComponent:convertToDisplay role = '+ role);
        roleDisplay = roleDisplay.concat(role.concat('; '));
    });
    return roleDisplay.substring(0, roleDisplay.length-2); // remove trailing semi-colon
  }

  public static FromViewModel(password: string, userId: number, username?: string, companyId?: number, roles?: Array<string>): UserSetupModel  {
    var model = new UserSetupModel();
    model.active = true;
    model.userId = userId;
    model.password = password;
    if (username) model.username = username;
    if (companyId) model.companyId = companyId;
    if (roles) model.roles = roles;
    return model;
  }
}