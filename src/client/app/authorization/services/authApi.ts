import { Injectable } from '@angular/core';
import { ExtHttp } from '../../shared/services';
import { Observable } from 'rxjs';

@Injectable()
export class AuthApiService {
    private _http: ExtHttp;

    constructor(exHttp: ExtHttp) {
        this._http = exHttp;
    }

    public signUp(userData): Observable<any> {
        return this._http
            .post("/auth/signup", JSON.stringify(userData))
            .map(res => res.json());
    }

    public signIn(userData): Observable<any> {
        return this._http
            .post("/auth/signin", JSON.stringify(userData))
            .map(res => res.json());
    }

    public forgotPassword(email: string): Observable<any> {
        return this._http
            .post("/api/forgot", JSON.stringify({ email: email }))
            .map(res => res.json());
    }

    public setNewPassword(password: string, token: string): Observable<any> {
        return this._http
            .post("/api/resetpassword", JSON.stringify({ password: password, token: token }))
            .map(res => res.json());
    }
}

export const AUTH_SERVICE_BINDINGS = [
    AuthApiService
];
