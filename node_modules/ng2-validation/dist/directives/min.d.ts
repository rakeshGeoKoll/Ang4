import { OnInit } from '@angular/core';
import { Validator, AbstractControl } from '@angular/forms';
export declare class MinValidator implements Validator, OnInit {
    min: number;
    private validator;
    ngOnInit(): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
}
