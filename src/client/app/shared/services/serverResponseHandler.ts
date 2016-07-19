import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
let messageKeys = require('../../../../shared/index').keys;
import { IdentityService } from'./identity';
import { Storage } from'./localStorage';
import * as _ from 'lodash';

@Injectable()
export class ServerResponseHandler {
    constructor(private router: Router, private identity: IdentityService, private storage: Storage) { }

    public handleError(error: any, allowArrayResult = false): any {       
        let serverMessage;
        switch (error.status) {
            case 401:
                this.identity.update(null);
                this.storage.removeItem("authorizationData");
                this.router.navigate(["/auth/signin"]);
                serverMessage = "Unauthorized";
                break;
            case 500:
                serverMessage = "Unexpected server error";
                break;
            default:
                serverMessage = this._getMessage(error.message, allowArrayResult);
                break;
        }
        return serverMessage;
    }

    public handleSuccess(result): any {
        if (result.key) {
            return this._getMessage(result);
        } else {
            return result;
        }
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
