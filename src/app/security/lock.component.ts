import { Component, OnInit, Injector } from '@angular/core';
import { SettingsService } from '../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'lock',
    templateUrl: './lock.component.html'
})
export class LockComponent implements OnInit {

    valForm: FormGroup;
    router: Router;

    constructor(public settings: SettingsService, fb: FormBuilder, private injector: Injector) {
        console.log('LockComponent:ctor');
        this.valForm = fb.group({
            'password': [null, Validators.required]
        });
    }

    submitForm($ev, value: any) {
        console.log('LockComponent:submitForm value = ' + value);
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            let redirect = '/';
            console.log('LockComponent:submitForm navigating to ' + redirect);
            this.router.navigate([redirect]);
        }
    }

    ngOnInit() {
        console.log('LockComponent:ngOnInit');
        this.router = this.injector.get(Router);
    }

}
