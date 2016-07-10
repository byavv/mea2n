import { Injectable } from '@angular/core';
import { ExtHttp } from './extHttp';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionService {
    constructor(private _http: ExtHttp) { }
    isAuthorized(roles): Observable<any> {
        return this._http
            .post("/auth/me", JSON.stringify({ roles: roles }))
    }
}

export const PERMISSION_SERVICE_PRIVIDERS = [
    PermissionService
];
