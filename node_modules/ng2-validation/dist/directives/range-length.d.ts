import { OnInit } from '@angular/core';
import { Validator, AbstractControl } from '@angular/forms';
export declare class RangeLengthValidator implements Validator, OnInit {
    rangeLength: [number];
    private validator;
    ngOnInit(): void;
    validate(c: AbstractControl): {
        [key: string]: any;
    };
}
