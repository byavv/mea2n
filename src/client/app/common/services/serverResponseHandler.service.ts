
import {Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import {Router} from 'angular2/router';
let messageKeys = require('../../../../shared/index').keys;
import {IdentityService} from'./identity.service';
import {Storage} from'./localStorage';
import * as _ from 'lodash';

@Injectable()
export class ServerResponseHandler {
    constructor(private router: Router, private identity: IdentityService, private storage: Storage) { }

    public handleError(error: Response, allowArrayResult = false): any {
        let errorMessage: any = error.json();
        return this._getMessage(errorMessage, allowArrayResult);
    }

    public handleSuccess(args): any {
        return this._getMessage(args);
    }

    public handle401(): any {
        this.identity.update(null);
        this.storage.removeItem("authorizationData");
        this.router.navigate(['Auth', 'Signin']);
    }

    public handle500(): any {
        //todo: notify user with error popup dialog or smth else
    }

    private _getMessage(source, allowArrayResult = false) {
        if (!!source && _.has(messageKeys, source.key)) {
            if (source.message) {
                if (_.isString(source.message)) {
                    return source.message;
                }              
                if (_.isArray(source.message)) {
                    if (allowArrayResult) {
                        return source.message;
                    } else {
                        return source.message[0];
                    }
                }
            } else {
                return messageKeys[source.key].default;
            }
        } else {
            return `Unexpected server error`;
        }
    }
}

export const SERVERHANDLER_SERVICE_BINDINGS = [
    ServerResponseHandler
];
