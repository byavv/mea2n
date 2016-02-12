import {Directive, ElementRef, Renderer, Optional, Attribute} from 'angular2/core';

@Directive({
    selector: '[restrictInput]',
    inputs: [
        "regex : restrictInput"
    ],
    host: {
        '(keypress)': 'onKeydown($event)',
        '(paste)': 'onPast($event)',
    }
})
export class RestrictInput {
    private expression: RegExp;
    private _regex: string;
    set regex(value) {
        this.expression = new RegExp(value);
        this._regex = value;
    };
    get regex() {
        return this._regex;
    }
    nopaste: boolean = true;
    constructor(private element: ElementRef, private renderer: Renderer, @Optional() @Attribute('nopaste') nopaste?: string) {
        this.nopaste = nopaste != null;
        this.regex = '[A-Za-z0-9]';
    }
    onKeydown(event: any) {
        if (this.expression && !this.expression.test(String.fromCharCode(event.keyCode))) {
            this.renderer.setElementStyle(this.element.nativeElement, "background", "indianred")
            setTimeout(() => {
                this.renderer.setElementStyle(this.element.nativeElement, "background", "white")
            }, 150)
            event.preventDefault();
        }
    }
    onPast(event) {
        if (this.nopaste) {
            event.preventDefault();
        }
    }
}
