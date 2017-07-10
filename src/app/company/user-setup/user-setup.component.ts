import { Component, ComponentRef, EventEmitter, OnInit, ViewEncapsulation} from '@angular/core';
import { Http } from '@angular/http';
import { UserSetupModel } from './user-setup-model';
import { UserSetupRolesModel } from './user-setup-roles-model';
import { UserSetupService } from './user-setup.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { UserSetupSaveCancelComponent } from './user-setup-save-cancel.component';
import { CompanySetupModel } from '../company-setup/company-setup-model';

@Component({
  selector: 'user-setup',
  templateUrl: './user-setup.component.html',
  //styleUrls: ['./user-setup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class UserSetupComponent implements OnInit {

    public constructor(fb: FormBuilder, private userService: UserSetupService) {
        console.log('UserSetupComponent:ctor ');

        this.userSetupMenuHelpText = userService.canAddUser ? UserSetupComponent.seperatorUserHelpText + UserSetupComponent.editUserHelpText : UserSetupComponent.editUserHelpText;

        this.passwordForm = fb.group({
            'password': [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6,12}$/)])],
            'confirmPassword': [null, Validators.required]
        }, { validator: CustomValidators.equalTo });

        var emailRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
        this.valForm = fb.group({
            'username': [null, Validators.compose([Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/)])],
            'accessLevel': [null, Validators.required],
            'company': [null, Validators.required],
            'store': [null, Validators.required],
            'passwordGroup': this.passwordForm
        });
    }

    public ngOnInit(): void {
        console.log('UserSetupComponent:ngOnInit...');
        this.onChangeTable(this.config);
        
        this.isCompanyManager = this.userService.isCompanyManager;

        console.log('UserSetupComponent:ngOnInit getting access levels...');
        this.userService.getAccessLevels()
        .subscribe(data => {
            this.accessLevelOptions = data;
        },error => this.errorMessage = <any>error);

//        console.log('UserSetupComponent:ngOnInit getting companies...');
//        this.userService.getCompanies()
//        .subscribe(data => {
//            this.companyOptions = data;
//        },error => this.errorMessage = <any>error);

//        console.log('UserSetupComponent:ngOnInit getting stores...');
//        this.userService.getStores()
//        .subscribe(data => {
//            this.storeOptions = data;
//            if (this.isCompanyManager) {
//                this.storeOptionsFiltered = this.storeOptions;
//            }
//        },error => this.errorMessage = <any>error);

        this.disableValidationControls();
        console.log('UserSetupComponent:ngOnInit isCompanyManager = ' + this.isCompanyManager + ';');
    }

    valForm: FormGroup;
    passwordForm: FormGroup;
    private userSetupMenuHelpText; // TODO: can make readonly after removing simulate user
    private static readonly editUserHelpText = "To edit a user, click on any row.";
    private static readonly seperatorUserHelpText =  "&nbsp;&nbsp;|&nbsp;";
    private accessLevelOptions: Array<UserSetupRolesModel> = [];
    private companyOptions: Array<CompanySetupModel> = [];
    private isUserManager:boolean = false;
    private isCompanyManager:boolean = false;
    private isStoreManager:boolean = false; 
    private usernameDisabled: boolean = false;
    private usernameSelected: string;
    private showUserEditForm: boolean = false;
    private showUserAddForm: boolean = false;
    private selectedRow: number = -1;
    private errorMessage: string;
    private showErrorMessage: boolean = false;
    private userData: Array<any> = [];
    private page: number = 1;
    private itemsPerPage: number = 10;
    private maxSize: number = 5;
    private numPages: number = 1;
    private length: number = 0;
    private rows: Array<any> = [];
    private columns: Array<any> = [
        { 
          title: 'Username',
          name: 'username',
          filtering: { filterString: '', placeholder: 'filter by username' },
          //className: 'text-warning',  // TODO: how does this change style?
        },
        { 
          title: 'Company', 
          name: 'companyName', 
          filtering: { filterString: '', placeholder: 'filter by company' } 
        },
        { 
          title: 'Access Level', 
          name: 'rolesDisplay', 
          filtering: { filterString: '', placeholder: 'filter by access' } 
        },
        { 
          title: 'Active', 
          name: 'activeDisplay', 
          filtering: { filterString: '', placeholder: 'filter by active' } 
        },
    ];

    private config: any = {
        paging: true,
        sorting: { columns: this.columns },
        filtering: { filterString: '' },
        className: ['table-striped', 'table-bordered', 'mb0', 'd-table-fixed'] // mb0=remove margin -/- .d-table-fixed=fix column width
    };

    private onSelect(optionSelected: any) {
        var values = optionSelected.split(':');
        var companyOptionIndex: number = values[0];
    }

    private onCellClick(data: any): any {
        this.showUserAddForm = false;
        this.errorMessage = null;
        var index = this.userData.findIndex(d => d.userId == data.row.userId);
        if (this.selectedRow != index) {
            this.showUserEditForm = true;
            this.usernameDisabled = true;
            this.usernameSelected = data.row.username;
            this.selectedRow = index;
            this.disableValidationControls();
        }
        else {
            this.showUserEditForm = false;
            this.usernameDisabled = true;
            this.usernameSelected = null;
            this.selectedRow = -1;
            this.enableValidationControls();
        }
        console.log('UserSetupComponent:onCellClick selectedRow  = ' + this.selectedRow  + '; showUserForm = ' + this.showUserEditForm );
    }

    private disableValidationControls(): void {
            this.valForm.controls["username"].disable();
            this.valForm.controls["company"].disable();
            this.valForm.controls["store"].disable();
            this.valForm.controls["accessLevel"].disable();
    }

    private enableValidationControls(): void {
            this.valForm.controls["username"].enable();
            if (this.isUserManager) this.valForm.controls["company"].enable();
            if (this.isUserManager || this.isCompanyManager) this.valForm.controls["store"].enable();
            this.valForm.controls["accessLevel"].enable();
    }

    private addUser() {
        console.log('UserSetupComponent:addUser showUserAddForm');
        if (this.showUserAddForm) {
            this.showUserAddForm = false;
            this.disableValidationControls();
        }
        else {
            this.showUserAddForm = true;
            this.enableValidationControls();
        }
        this.valForm.reset();
        this.showUserEditForm = false;
        this.usernameDisabled = false;
        this.usernameSelected = null;
        this.errorMessage = null;
    }

    private cancelForm() {
        console.log('UserSetupComponent:cancelUser');
        this.valForm.reset();
        this.showUserAddForm = false;
        this.showUserEditForm = false;
        this.selectedRow = -1;
        this.errorMessage = null;
    }

    private submitForm($ev, value: any) {
        console.log('UserSetupComponent:submitForm');
      
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        
        for (let c in this.passwordForm.controls) {
            this.passwordForm.controls[c].markAsTouched();
        }

        if (this.valForm.valid) {
            if (this.showUserAddForm) {
                console.log('UserSetupComponent:submitForm add user');
                var model = UserSetupModel.FromViewModel(value.passwordGroup.password, 0,
                                                            value.username, (value.company != null) ? value.company.companyId : 0, [value.accessLevel.name]);
                this.userService.postUser(model).subscribe(res => { this.onChangeTable(this.config); this.cancelForm() }, error => {this.errorMessage = <any>error; } );
            }
            else {
                console.log('UserSetupComponent:submitForm edit user');
                var model1 = UserSetupModel.FromViewModel(value.passwordGroup.password,this.userData[this.selectedRow].userId);
                var model: UserSetupModel = this.userData[this.selectedRow];
                model.password = value.passwordGroup.password;
                this.userService.putUser(model).subscribe(res => { this.cancelForm() }, error => {this.errorMessage = <any>error; } );
            }
        }
    }

    private changePage(page: any, data: Array<any> = this.userData): Array<any> {
        console.log('UserSetupComponent:changePage...');
        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    }

    private changeSort(data: any, config: any): any {
        console.log('UserSetupComponent:changeSort...');

        if (!config.sorting) {
            return data;
        }

        let columns = this.config.sorting.columns || [];
        let columnName: string = void 0;
        let sort: string = void 0;
        
        //let columnName: string = null;
        //let sort: string = null;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }

        if (!columnName) {
            return data;
        }

        // simple sorting
        return data.sort((previous: any, current: any) => {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            } else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }

    private convertToDisplay(roles: Array<string>): string
    {
        let roleDisplay: string = '';
        roles.forEach((role: string) => {
            console.log('UserSetupComponent:convertToDisplay role = '+ role);
            roleDisplay = roleDisplay.concat(role.concat('; '));
        });
        return roleDisplay.substring(0, roleDisplay.length-2); // remove trailing semi-colon
    }

    private changeFilter(data: any, config: any): any {
        console.log('UserSetupComponent:changeFilter...');
        let filteredData: Array<any> = data;
        this.columns.forEach((column: any) => {
            if (column.filtering) {
                filteredData = filteredData.filter((item: UserSetupModel) => {
                    // convert model to view since item cannot be cast
                    var usm = new UserSetupModel();
                    usm.active = item.active;
                    usm.roles = item.roles;

                    if (column.name == 'activeDisplay') {
                      item[column.name] = usm.displayActive;
                    }
                    if (column.name == 'rolesDisplay') {
                      item[column.name] = usm.displayRoles;
                    }
                    return (item[column.name] != null) ? item[column.name].match(column.filtering.filterString) : ' ';
                });
            }
        });

        if (!config.filtering) {
            return filteredData;
        }

        if (config.filtering.columnName) {
            return filteredData.filter((item: any) =>
                item[config.filtering.columnName].match(this.config.filtering.filterString));
        }

        let tempArray: Array<any> = [];
        filteredData.forEach((item: any) => {
            let flag = false;
            this.columns.forEach((column: any) => {
                if (item[column.name] != null && item[column.name].toString().match(this.config.filtering.filterString)) {
                    flag = true;
                } 
            });
            if (flag) {
                tempArray.push(item);
            }
        });
        filteredData = tempArray;

        return filteredData;
    }

    private onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
        console.log('UserSetupComponent:onChangeTable...');
        
        if (config.filtering) {
            (<any>Object).assign(this.config.filtering, config.filtering);
        }

        if (config.sorting) {
            (<any>Object).assign(this.config.sorting, config.sorting);
        }

        console.log('UserSetupComponent:onChangeTable getting users...');
        this.userService.getUsers()
        .subscribe(users => {
            this.userData = users;
            this.length = this.userData.length;
            let filteredData = this.changeFilter(this.userData, this.config);
            let sortedData = this.changeSort(filteredData, this.config);
            this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
            this.length = sortedData.length;
        },error => { this.errorMessage = <any>error; } );
    }
}
