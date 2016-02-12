import {
ControlGroup,
FORM_DIRECTIVES,
ControlValueAccessor,
NgControl,
Control,
CORE_DIRECTIVES
} from 'angular2/common';
import {Component, Self, EventEmitter, ElementRef} from 'angular2/core';
import * as browser from "angular2/platform/browser";
import {Ruler, Rectangle} from "angular2/src/platform/browser/ruler";
import * as Rx from 'rxjs';
import {RestrictInput} from "../../directives/directives";

@Component({
    selector: 'securedinput',
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, RestrictInput],
    template: require("./securedInput.component.html"),
    styles: [
        require('!raw!./style.less')
    ],
    inputs: ['id']
})
export class SecureInput implements ControlValueAccessor {
    someValue: boolean = true;
    id: string;
    currentState: string = 'default';
    onChange: EventEmitter<any> = new EventEmitter();
    onTouched: EventEmitter<any> = new EventEmitter();
    form: ControlGroup;
    password: string = "";

    constructor( @Self() private control: NgControl, private element: ElementRef) {
        control.valueAccessor = this;
        this.form = new ControlGroup({
            password: new Control("")
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
            this.draw("default");
            if (this.control.control.dirty) {
                this.draw("danger");
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
