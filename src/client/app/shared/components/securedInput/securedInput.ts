import { NgControl, FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, ControlValueAccessor } from '@angular/forms';
import { Component, Self, Optional, EventEmitter, ElementRef } from '@angular/core';
import { RestrictInput } from "../../directives";

@Component({
    selector: 'securedinput',
    directives: [REACTIVE_FORM_DIRECTIVES, RestrictInput],
    template: require("./securedInput.html"),
    styles: [
        require('./style.scss')
    ],
    inputs: ['id']
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
                this.animate(val.password);
            });
    }

    animate(value) {
        if (value) {
            if (/^(?=.{0,5}$).*/.test(value)) {
                this.draw("danger");
            }
            if (/^[a-zA-Z0-9]{6,}$/.test(value)) {
                this.draw("good");
            }
            if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(value)) {
                this.draw("strong");
            }
        } else {
            if (this.form.controls['password'].dirty) {
                this.draw("danger");
            } else {
                this.draw("default");
            }
        }
    }

    draw(status) {
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
