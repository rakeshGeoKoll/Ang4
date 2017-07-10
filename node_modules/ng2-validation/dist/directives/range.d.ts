import { OnInit } from '@angular/core';
import { Validator, AbstractControl } from '@angular/forms';
export declare class RangeValidator implements Validator, OnInit {
    range: [number];
    private validator;
    ngOnInit(): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
}
