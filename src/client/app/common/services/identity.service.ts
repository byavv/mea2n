import {Injectable} from 'angular2/core';
import * as Rx from 'rxjs';
import {User} from '../models/user.model';
import {Storage} from './localStorage';

@Injectable()
export class IdentityService {
    private _user: User;
    public get user(): User {
        return this._user;
    }
    public set user(value) {
        this._user = value;
    }
    public identitySubject: Rx.Subject<User> = new Rx.Subject<User>();
    constructor(private localStorage: Storage) {
        this.user = new User();
    }
    public update(identityData: User): void {
        let user = new User();
        if (!!identityData && !!identityData.token) {
            user.token = identityData.token;
        }
        this.user = user;
        this.identitySubject.next(this.user);
    }
}
