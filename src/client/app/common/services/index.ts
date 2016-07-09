import {IdentityService} from './identity';
import {Storage, STORAGE_PROVIDERS} from './localStorage';
import {ExtHttp} from './extHttp';
import {ServerResponseHandler} from './serverResponseHandler';
import {PermissionService} from './permission';

export * from './identity';
export * from './extHttp';
export * from './serverResponseHandler';
export * from './localStorage';
export * from './permission';

export var APP_SERVICES_PROVIDERS: Array<any> = [
    ExtHttp,
    IdentityService,
    ServerResponseHandler,
    PermissionService,
    ...STORAGE_PROVIDERS
];