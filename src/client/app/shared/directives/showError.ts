import {
    FormGroupDirective,
    FormGroup,
    FormControlName,
    FormControl
} from '@angular/forms';

import {Component, Directive, Host, Input} from '@angular/core';
import {RegExpWrapper, print, isPresent} from '@angular/compiler/src/facade/lang';

@Component({
    selector: 'show-error',
    template: `
        <span class='error-span' *ngIf="errorMessage !== null">{{errorMessage}}</span>
    `,
    styles: [
        `
        .error-span {
            margin-top: 0rem;
            display: inline-block;
            font-size: 0.9rem;
        }
        `
    ]
})
export class ShowError {
    formDir: FormGroupDirective;
    // name of binded form control
    @Input()
    control: string;
    // {'required' : 'field is required', 'customError': 'field value has wrong format'}
    @Input()
    errors: { [code: string]: string; } = {};
    constructor( @Host() formDir: FormGroupDirective) { this.formDir = formDir; }
    get errorMessage(): string {
        var form: FormGroup = this.formDir.form;
        var control = form.find(this.control);
        if (isPresent(control)) {
            for (var error in this.errors) {
                if (control.hasError(error)) {
                    return this.errors[error]
                }
            }
        }
        return null;
    }
}