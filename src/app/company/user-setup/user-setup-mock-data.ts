import { UserSetupModel } from './user-setup-model';
import { UserSetupRolesModel } from './user-setup-roles-model';
import { CompanySetupModel } from '../company-setup/company-setup-model';

export const UserSetupMockData: Array<any> = [
    { 
        'active': true, 
        'emailAddress': 'johndoe@geocomm.com', 
        'userId': 1,  
        'username': 'John', 
        'password': 'geo123', 
        'roles': ['UserManager', 'Guest'], 
        'firstName': 'John', 
        'lastName': 'Doe',
        'companyId': 1,
        'companyName': 'GeoComm',
        'storeId': 1,
        'storeName': '',
    }
];

export const UserSetupAccessLevelMockData: Array<UserSetupRolesModel> = [
    {
        roleId: 1,
        name: "Guest",
        description: "Guest - ReadOnly account",
        active: true,
    }, {
        roleId: 2,
        name: "UserManager",
        description: "User Administration Manager",
        active: true,
    }
];

export const UserSetupCompanyMockData: Array<CompanySetupModel> = [
    { 
         "companyId": 1, "companyName": 'Company A', "active": true, "features": [
            {"id": 1, "name": 'Users', "enabled": true }
        ],
    },
    { 
        "companyId": 2, "companyName": 'Company B', "active": true, "features": [ 
            {"id": 1, "name": 'Users', "enabled": false }
        ], 
    }
];
