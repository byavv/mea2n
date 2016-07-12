import {Injectable} from '@angular/core';
import {ServerResponseHandler} from "./serverResponseHandler";
import {IdentityService} from "./identity"
import {Http, Headers, RequestOptions, RequestOptionsArgs, Response, RequestMethod, Request} from '@angular/http';
import {Subject, Observable} from 'rxjs';

export enum Action { QueryStart, QueryStop };

@Injectable()
export class ExtHttp {
    process: Subject<any> = new Subject<any>();
    constructor(private _http: Http,
        private serverHandler: ServerResponseHandler,
        private identity: IdentityService) {
    }

    private _createAuthHeaders(): Headers {
        let identityData = this.identity.user;
        let headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        if (!!identityData && identityData.token) {
            headers.append('Authorization', `Bearer ${identityData.token}`)
        }
        return headers;
    }

    public get(url: string, options?: RequestOptionsArgs) {
        return this._request(RequestMethod.Get, url, null, options);
    }

    public post(url: string, body: string, options?: RequestOptionsArgs) {
        return this._request(RequestMethod.Post, url, body, options);
    }

    public put(url: string, body: string, options?: RequestOptionsArgs) {
        return this._request(RequestMethod.Put, url, body, options);
    }

    public delete(url: string, options?: RequestOptionsArgs) {
        return this._request(RequestMethod.Delete, url, null, options);
    }

    private _request(method: RequestMethod, url: string, body?: string, options?: RequestOptionsArgs): Observable<any> {
        let requestOptions = new RequestOptions(Object.assign({
            method: method,
            url: url,
            body: body,
            headers: this._createAuthHeaders()
        }, options));
        return Observable.create((observer) => {
            this.process.next(Action.QueryStart);
            this._http.request(new Request(requestOptions))
                .finally(() => {
                    this.process.next(Action.QueryStop);
                })
                .subscribe(
                (res) => {
                    observer.next(res);
                    observer.complete();
                },
                (err) => {
                    switch (err.status) {
                        case 401:
                            this.serverHandler.handle401();
                            observer.complete();
                            break;
                        case 500:
                            this.serverHandler.handle500();
                            observer.complete();
                            break;
                        default:
                            observer.error(err);
                            break;
                    }
                })
        })
    }
    //todo: add caching
}
