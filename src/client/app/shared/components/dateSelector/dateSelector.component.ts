import {Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as appValidators from '../../../lib/formValidators';
import {FORM_DIRECTIVES, Control, ControlGroup, NgControl, ControlValueAccessor, Validators} from '@angular/common';

@Component({
    selector: 'dateSelector[ngControl]',
    directives: [FORM_DIRECTIVES],
    template: require("./dateSelector.component.html")
})
export class DateSelector implements ControlValueAccessor {
    date: any = {
        day: 1,
        month: 5,
        year: 1990
    };
    dateForm: ControlGroup;
    onChange: EventEmitter<any> = new EventEmitter();
    onTouched: any;
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
    constructor(private cd: NgControl) {
        cd.valueAccessor = this;
        this.dateForm = new ControlGroup({
            day: new Control(1, Validators.compose([Validators.required, appValidators.minValue(1), appValidators.maxValue(31)])),
            month: new Control(5, Validators.required),
            year: new Control(1990, Validators.compose([Validators.required, appValidators.minValue(1915), appValidators.maxValue(new Date().getFullYear())]))
        });
        this.dateForm.valueChanges
            .subscribe((val) => {
                if (this.dateForm.valid) {
                    this.onChange.emit(this._computeDate());
                } else {
                    this.cd.control.setErrors({ "wrongDate": true });
                }
            });
    }

    _computeDate() {
        return new Date(this.date.year, this.date.month, this.date.day);
    }
    _updateValue(date) {
        let dat = new Date(date);
        this.date.day = dat.getDate();
        this.date.month = dat.getMonth();
        this.date.year = dat.getFullYear();
    }    
    writeValue(date) {
        this._updateValue(date);
    }
    registerOnChange(fn): void {
        this.onChange.subscribe(fn);
    }
    registerOnTouched(fn): void {
        this.onTouched = fn;
    }
}