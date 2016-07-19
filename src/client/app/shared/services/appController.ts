import { Injectable, NgZone } from '@angular/core';
import { ExtHttp } from './extHttp';
import { BackEndApi } from "./backEndApi";
import { ReplaySubject, Observable } from "rxjs";

@Injectable()
export class AppController {
    _init$: ReplaySubject<any> = new ReplaySubject<any>();

    config: any = {}

    constructor(private _backEnd: BackEndApi, private _ngZone: NgZone) { }
    start() {
        this._ngZone.runOutsideAngular(() => {
            this._loadAppDefaults((config) => {
                this._ngZone.run(() => { this._init$.next(Object.assign(this.config, config)); });
            })
        });
    }

    get init$(): Observable<any> {
        return this._init$.asObservable();
    }

    private _loadAppDefaults(doneCallback: (config: any) => void) {
        Observable.zip(
            // load app config
            this._backEnd.loadDefaults(),
            (config) => config
        )
            .subscribe(value => {
                doneCallback(value);
            }, console.error);
    }
}
