import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[href][inert]',
    host: {
        '(click)': 'preventDefault($event)'
    }
})
export class InertLink {
    @Input() href;
    preventDefault(event) {
        if (this.href.length == 0) event.preventDefault();
    }
}