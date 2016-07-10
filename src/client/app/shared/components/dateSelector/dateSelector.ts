import { Component, AfterViewInit, Output, EventEmitter, Self, Optional } from '@angular/core';
import * as appValidators from '../../../lib/formValidators';
import { NgControl, FormControl, FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'dateSelector[ngModel]',
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: require("./dateSelector.html")
})
export class DateSelector implements ControlValueAccessor {
    date: any = {
        day: 1,
        month: 5,
        year: 1990
    };
    dateForm: FormGroup;
    months: any[] = [
        { name: "January", value: 0 },
        { name: "Fabuary", value: 1 },
        { name: "March", value: 2 },
        { name: "April", value: 3 },
        { name: "May", value: 4 },
        { name: "June", value: 5 },
        { name: "July", value: 6 },
        { name: "August", value: 7 },
        { name: "September", value: 8 },
        { name: "October", value: 9 },
        { name: "November", value: 10 },
        { name: "December", value: 11 }
    ];
    constructor( @Optional() @Self() private cd: NgControl) {
        if (cd) cd.valueAccessor = this;
        this.dateForm = new FormGroup({
            day: new FormControl(1, Validators.compose([Validators.required, appValidators.minValue(1), appValidators.maxValue(31)])),
            month: new FormControl(5, Validators.required),
            year: new FormControl(1990, Validators.compose([Validators.required, appValidators.minValue(1915), appValidators.maxValue(new Date().getFullYear())]))
        });
        this.dateForm.valueChanges
            .subscribe((val) => {
                if (this.dateForm.valid) {
                    let newValue = this._computeDate();
                    if (this.cd) this.cd.viewToModelUpdate(newValue);
                    this.onChange(this._computeDate())
                } else {
                    this.cd.control.setErrors({ "wrongDate": true });
                }
            });
    }


    _computeDate() {
        return new Date(this.date.year, this.date.month, this.date.day);
    }
    _updateValue(date) {
        let _d = new Date(date);
        this.date.day = _d.getDate();
        this.date.month = _d.getMonth();
        this.date.year = _d.getFullYear();
    }

    /**
     * ControlValueAccessor
     */
    onChange = (_: any) => {
    };
    onTouched = () => {
    };
    writeValue(value) {
        this._updateValue(value);
    }
    registerOnChange(fn): void {
        this.onChange = fn;
    }
    registerOnTouched(fn): void {
        this.onTouched = fn;
    }
}