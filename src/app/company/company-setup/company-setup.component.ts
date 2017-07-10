import { Component, OnInit } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { CompanySetupModel } from './company-setup-model';
import { CompanySetupService } from './company-setup.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { CompanySetupFeatureModel } from './company-setup-feature-model';

@Component({
    selector: 'company-setup',
    templateUrl: './company-setup.component.html'
})
export class CompanySetupComponent implements OnInit {
    companies: CompanySetupModel[];
    valForm: FormGroup;
    companyForm: FormGroup;

    private companySetupMenuHelpText; // TODO: can make readonly after removing simulate user
    private static editCompanyHelpText = "To edit a company, click on any row.";
    private static seperator = "&nbsp;";
    private static seperatorCompanyHelpText = CompanySetupComponent.seperator + CompanySetupComponent.seperator + "|" + CompanySetupComponent.seperator;    
    private featureData: Array<CompanySetupFeatureModel>;
    private isUserManager: boolean = true;
    private showCompanyEditForm: boolean = false;
    private showCompanyAddForm: boolean = false;
    private selectedRow: number = -1;
    private errorMessage: string;
    private companyData: Array<any> = [];
    private page: number = 1;
    private itemsPerPage: number = 10;
    private maxSize: number = 5;
    private numPages: number = 1;
    private length: number = 0;
    private companyModel: CompanySetupModel;
    private rows: Array<any> = [];
    private columns: Array<any> = [
        {
            title: 'Company',
            name: 'companyName',
            filtering: { filterString: '', placeholder: 'filter by company name' },
            //className: 'text-warning',  // TODO: how does this change style?
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

    private onCellClick(data: any): any {
        this.showCompanyAddForm = false;

        var index = this.companyData.findIndex(d => d.companyId == data.row.companyId);
        if (this.selectedRow != index) {
            this.showCompanyEditForm = true;
            this.selectedRow = index;
            this.companyForm.controls['companyName'].setValue(this.companyData[this.selectedRow].companyName);
        }
        else {
            this.showCompanyEditForm = false;
            this.selectedRow = -1;
        }
        console.log('CompanySetupComponent:onCellClick selectedRow  = ' + this.selectedRow + '; showCompanyForm = ' + this.showCompanyEditForm);
    }

    constructor(fb: FormBuilder, private service: CompanySetupService) {
        console.log('CompanySetupComponent:ctor');
        this.companySetupMenuHelpText = CompanySetupComponent.seperatorCompanyHelpText + CompanySetupComponent.editCompanyHelpText;

        this.companyForm = fb.group({
            'companyName': [null, Validators.required]
        });

        this.valForm = fb.group({
            'companyGroup': this.companyForm
        });
    }

    public ngOnInit(): void {
        console.log('CompanySetupComponent:ngOnInit...');

        this.onChangeTable(this.config);
    }


    private addCompany() {
        if (!this.featureData) {
            console.log('CompanySetupComponent:addCompany getting features...');
            this.service.getFeatures()
                .subscribe(features => {
                    this.featureData = features;
                }, error => this.errorMessage = <any>error);
        }
        this.valForm.reset();
        this.showCompanyAddForm = !this.showCompanyAddForm;
        this.showCompanyEditForm = false;
        console.log('CompanySetupComponent:addCompany showCompanyAddForm');
    }

    private cancelForm() {
        console.log('CompanySetupComponent:cancelCompany');
        this.valForm.reset();
        this.showCompanyAddForm = false;
        this.showCompanyEditForm = false;
        this.selectedRow = -1;
    }

    private refreshData() {
        this.onChangeTable(this.config);
        this.cancelForm();
    }

    private submitForm($ev, value: any, httpType: any) {
        console.log('CompanySetupComponent:submitForm');

        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }

        for (let c in this.companyForm.controls) {
            this.companyForm.controls[c].markAsTouched();
        }

        if (this.valForm.valid) {
            console.log('CompanySetupComponent:submitForm is valid');

            if (this.showCompanyAddForm) {
                var model = this.FormToModel(this.companyForm);
                this.service.postCompany(model)
                    .subscribe(res => { this.refreshData() }, error => this.errorMessage = <any>error);
            } else {
                this.companyData[this.selectedRow].companyName = value.companyGroup.companyName;
                this.service.putCompany(this.companyData[this.selectedRow])
                    .subscribe(res => { this.refreshData() }, error => this.errorMessage = <any>error);
            }
        }
    }

    private toggleFeature(feature:CompanySetupFeatureModel): void {
        feature.enabled = !feature.enabled;
    }

    private changePage(page: any, data: Array<any> = this.companyData): Array<any> {

        console.log('CompanySetupComponent:changePage...');

        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    }

    private changeSort(data: any, config: any): any {

        console.log('CompanySetupComponent:changeSort...');

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

    private changeFilter(data: any, config: any): any {

        console.log('CompanySetupComponent:changeFilter...');

        let filteredData: Array<any> = data;
        this.columns.forEach((column: any) => {
            if (column.filtering) {
                filteredData = filteredData.filter((item: any) => {
                    // convert model to view
                    if (column.name == 'activeDisplay') {
                        item[column.name] = item['active'] ? 'Active' : 'Inactive';
                    }
                    if (column.name == 'rolesDisplay') {
                        item[column.name] = item['roles'][0];
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
        console.log('CompanySetupComponent:onChangeTable...');

        if (config.filtering) {
            (<any>Object).assign(this.config.filtering, config.filtering);
        }

        if (config.sorting) {
            (<any>Object).assign(this.config.sorting, config.sorting);
        }

        console.log('CompanySetupComponent:onChangeTable getting companies...');
        this.service.getCompanies()
            .subscribe(companies => {
                this.companyData = companies;
                this.length = this.companyData.length;
                let filteredData = this.changeFilter(this.companyData, this.config);
                let sortedData = this.changeSort(filteredData, this.config);
                this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
                this.length = sortedData.length;
            }, error => this.errorMessage = <any>error);
    }

    FormToModel(f: FormGroup) {
        var model = new CompanySetupModel();
        model.companyName = f.controls["companyName"].value;
        model.features = this.featureData;
        //model.active = true;
        return model;
    }
  

}