import { Component, ComponentRef, EventEmitter, OnInit, ViewEncapsulation} from '@angular/core';
import { Http } from '@angular/http';
import { UserSetupModel } from './user-setup-model';
import { UserSetupService } from './user-setup.service';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'user-setup-save-cancel',
  templateUrl: './user-setup-save-cancel.component.html',
  //styleUrls: ['./user-setup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class UserSetupSaveCancelComponent implements OnInit {

    valForm: FormGroup;
    passwordForm: FormGroup;

    public constructor(fb: FormBuilder, private service: UserSetupService) {
        console.log('UserSetupSaveCancelComponent:ctor ');

        this.passwordForm = fb.group({
            'password': [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]{6,12}$')])],
            'confirmPassword': [null, Validators.required]
        }, { validator: CustomValidators.equalTo });

        this.valForm = fb.group({
            'passwordGroup': this.passwordForm
        });
    }

    public ngOnInit(): void {
        console.log('UserSetupSaveCancelComponent:ngOnInit...');
    }
    
    // private usernameDisabled: boolean = false;
    // private showUserEditForm: boolean = false;
    // private showUserAddForm: boolean = false;
    // private selectedRow: number = -1;

    private cancelForm() {
        console.log('UserSetupSaveCancelComponent:cancelUser');
        this.valForm.reset();
        
        // this.showUserAddForm = false;
        // this.showUserEditForm = false;
        // this.selectedRow = -1;
    }

    private submitForm($ev, value: any) {
        console.log('UserSetupSaveCancelComponent:submitForm');
      
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        
        for (let c in this.passwordForm.controls) {
            this.passwordForm.controls[c].markAsTouched();
        }

        if (this.valForm.valid) {
            console.log('UserSetupSaveCancelComponent:submitForm is valid');
            
            // update password and send to webapi
            // this.userData[this.selectedRow].password = value.passwordGroup.password;
            // this.service.putUser(this.userData[this.selectedRow]).subscribe(res => { this.cancelForm() }, error => this.errorMessage = <any>error);
        }
    }
}
