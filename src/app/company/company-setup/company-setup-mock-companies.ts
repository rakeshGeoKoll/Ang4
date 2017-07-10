import { CompanySetupModel } from './company-setup-model';

export var CompanySetupMockData: CompanySetupModel[] = [
    { 
        "companyId": 1, "companyName": 'Company A', "active": true, "features": [
            {"id": 1, "name": 'Users', "enabled": true }
        ],
    }, { 
        "companyId": 2, "companyName": 'Company B', "active": true, "features": [ 
            {"id": 1, "name": 'Users', "enabled": false }
        ], 
    }, 
];