import {IdentityService} from './identity.service';
import {Storage} from './localStorage';
import {ExtHttp} from './authHttp.service';
import {ServerResponseHandler} from './serverResponseHandler.service';
import {PermissionService} from './permission.service';

export * from './identity.service';
export * from './authHttp.service';
export * from './serverResponseHandler.service';
export * from './localStorage';
export * from './permission.service';

export var APP_SERVICES_PROVIDERS: Array<any> = [
    ExtHttp,
    IdentityService,
    ServerResponseHandler,
    PermissionService,
    Storage
];