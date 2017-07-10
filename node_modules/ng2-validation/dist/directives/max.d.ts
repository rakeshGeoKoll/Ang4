import { OnInit } from '@angular/core';
import { Validator, AbstractControl } from '@angular/forms';
export declare class MaxValidator implements Validator, OnInit {
    max: number;
    private validator;
    ngOnInit(): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
}
