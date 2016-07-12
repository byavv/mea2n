import {Component, EventEmitter} from '@angular/core';

@Component({
    selector: 'alert',   
    template: require("./alert.html"),
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