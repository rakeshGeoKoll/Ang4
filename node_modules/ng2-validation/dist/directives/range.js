"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var index_1 = require('../index');
var RANGE_VALIDATOR = {
    provide: forms_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return RangeValidator; }),
    multi: true
};
var RangeValidator = (function () {
    function RangeValidator() {
    }
    RangeValidator.prototype.ngOnInit = function () {
        this.validator = index_1.CustomValidators.range(this.range);
    };
    RangeValidator.prototype.validate = function (c) {
        return this.validator(c);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], RangeValidator.prototype, "range", void 0);
    RangeValidator = __decorate([
        core_1.Directive({
            selector: '[range][formControlName],[range][formControl],[range][ngModel]',
            providers: [RANGE_VALIDATOR]
        }), 
        __metadata('design:paramtypes', [])
    ], RangeValidator);
    return RangeValidator;
}());
exports.RangeValidator = RangeValidator;
//# sourceMappingURL=range.js.map