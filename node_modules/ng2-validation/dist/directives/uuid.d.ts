import { OnInit } from '@angular/core';
import { Validator, AbstractControl } from '@angular/forms';
export declare class UUIDValidator implements Validator, OnInit {
    uuid: any;
    private validator;
    ngOnInit(): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
}
