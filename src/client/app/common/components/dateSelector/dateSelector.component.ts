import {Component, AfterViewInit, Output, EventEmitter } from 'angular2/core';
import * as appValidators from '../../../lib/formValidators';
import {FORM_DIRECTIVES, Control, ControlGroup, NgControl, ControlValueAccessor, Validators, CORE_DIRECTIVES} from 'angular2/common';
@Component({
    selector: 'dateSelector[ngControl]',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
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
    /**
     * ControlValueAccessor
     */
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