import {Component, Output, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
    selector: 'alert',
    directives: [CORE_DIRECTIVES],
    template: require("./alert.component.html"),
    inputs: ["type"],
    outputs: ["onclose"],
    styles: [`
        .alert{
            font-size:12px; 
            padding: 11px 7px;
        }
   `]
})

export class Alert {
    visible: boolean = true;
    onclose: EventEmitter<any> = new EventEmitter();
    close() {
        this.onclose.emit(null);
    }
}