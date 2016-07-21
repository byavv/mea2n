import { Directive, ElementRef, Renderer, Optional, Attribute } from '@angular/core';
import { StringWrapper } from '@angular/compiler/src/facade/lang';
@Directive({
    selector: '[restrictInput]',
    inputs: [
        "regex : restrictInput"
    ],
    host: {
        '(keypress)': 'onKeydown($event)',
        '(paste)': 'onPaste($event)',
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
        this.regex = '[A-Za-z0-9]'; //default
    }
    
    onKeydown(event: any) {       
        if (this.expression && !this.expression.test(StringWrapper.fromCharCode(event.keyCode || event.charCode))) {
            this.renderer.setElementStyle(this.element.nativeElement, "background", "indianred")
            setTimeout(() => {
                this.renderer.setElementStyle(this.element.nativeElement, "background", "white")
            }, 150)
            event.preventDefault();          
        }
    }

    onPaste(event) {
        if (this.nopaste) {
            event.preventDefault();
        }
    }
}
