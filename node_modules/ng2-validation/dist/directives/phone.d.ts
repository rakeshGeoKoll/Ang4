import { OnInit } from '@angular/core';
import { Validator, AbstractControl } from '@angular/forms';
export declare class PhoneValidator implements Validator, OnInit {
    phone: string;
    private validator;
    ngOnInit(): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
}
