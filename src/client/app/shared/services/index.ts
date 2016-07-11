import { IdentityService } from './identity';
import { Storage, STORAGE_PROVIDERS } from './localStorage';
import { ExtHttp } from './extHttp';
import { ServerResponseHandler } from './serverResponseHandler';
import { PermissionService } from './permission';
import { AppController } from './appController';
import { BackEndApi } from './backEndApi';

export * from './identity';
export * from './extHttp';
export * from './serverResponseHandler';
export * from './localStorage';
export * from './permission';
export * from './appController';
export * from './backEndApi';

export var APP_SERVICES_PROVIDERS: Array<any> = [
    AppController,
    ExtHttp,
    IdentityService,
    ServerResponseHandler,    
    ...STORAGE_PROVIDERS,
    PermissionService,
    BackEndApi
];