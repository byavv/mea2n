import { NgControl, FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, ControlValueAccessor } from '@angular/forms';
import { Component, Self, Optional, EventEmitter, ElementRef, trigger, state, style, keyframes, transition, animate } from '@angular/core';
import { RestrictInput } from "../../directives";

@Component({
    selector: 'securedinput',
    directives: [REACTIVE_FORM_DIRECTIVES, RestrictInput],
    template: require("./securedInput.html"),
    styles: [require('./style.scss')],
    inputs: ['id'],
    animations: [
        trigger('passwordState', [
            state('strong', style({
                fill: '#267c1d',
                transform: 'translateX(0)'
            })),
            state('good', style({
                fill: '#EE7B00',
                transform: 'translateX(0)'
            })),
            state('danger', style({
                fill: '#a3000a',
                transform: 'translateX(0)'
            })),
            state('default', style({
                fill: '#eeeeee',
                transform: 'translateX(0)'
            })),
            transition('* => *', animate('100ms ease-in'))
        ])
    ]
})
export class SecureInput implements ControlValueAccessor {
    id: string;
    currentState: string = 'default';
    onChange: EventEmitter<any> = new EventEmitter();
    onTouched: EventEmitter<any> = new EventEmitter();
    form: FormGroup;
    password: string = "";

    constructor( @Self() @Optional() private control: NgControl, fBuilder: FormBuilder) {
        if (control) control.valueAccessor = this;
        this.form = fBuilder.group({
            password: [""]
        });
        this.form.valueChanges
            .subscribe((val) => {
                this.onChange.emit(val.password);
                this.setState(val.password);
            });
    }

    setState(value) {
        if (value) {
            if (/^(?=.{0,5}$).*/.test(value)) {
                this._set("danger");
            }
            if (/^[a-zA-Z0-9]{6,}$/.test(value)) {
                this._set("good");
            }
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(value)) {
                this._set("strong");
            }
        } else {
            if (this.form.controls['password'].dirty) {
                this._set("danger");
            } else {
                this._set("default");
            }
        }
    }

    _set(status) {
        if (status !== this.currentState) {
            this.currentState = status;
        }
    }

    /**
     * ControlValueAccessor
     */
    writeValue(value) {
        this.password = value;
    }
    registerOnChange(fn): void {
        this.onChange.subscribe(fn);
    }
    registerOnTouched(fn): void {
        this.onTouched.subscribe(fn);
    }
}
