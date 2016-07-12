import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ExtHttp } from './extHttp';
import { Observable } from 'rxjs';

@Injectable()
export class BackEndApi {
  

    constructor(private _http: Http) {
      
    }

    public loadDefaults(): Observable<any> {
        return this._http
            .get("/app/defaults")
            .map(res => res.json());
    }
}
