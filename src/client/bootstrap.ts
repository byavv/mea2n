import 'angular2-universal/polyfills';
import {bootstrap} from 'angular2/platform/browser'
import {global} from 'angular2/src/facade/lang'
import {ComponentRef} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {FORM_PROVIDERS} from 'angular2/common';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {APP_SERVICES_PROVIDERS, IdentityService, Storage} from "./app/common/services/services";
import {App} from './app/app';
import {prebootComplete} from 'angular2-universal';

const PROVIDERS = [
    ...HTTP_PROVIDERS,
    ...FORM_PROVIDERS,
    ...ROUTER_PROVIDERS,
    ...APP_SERVICES_PROVIDERS
];

bootstrap(App, PROVIDERS)
    .then((appRef: ComponentRef) => {
        prebootComplete(appRef);
        let storage: Storage = appRef.injector.get(Storage);
        let identity: IdentityService = appRef.injector.get(IdentityService);
        storage.initStorage(window.localStorage);
        storage.getItem("authorizationData").then((value) => {
            identity.update(JSON.parse(value));
        })
    }, error => console.log(error))
