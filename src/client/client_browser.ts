import 'es6-shim';
import 'es6-promise';
import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import 'zone.js/dist/long-stack-trace-zone';

import {bootstrap} from 'angular2-universal-preview';

import {ComponentRef} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {FORM_PROVIDERS} from 'angular2/common';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {APP_SERVICES_PROVIDERS, IdentityService, Storage} from "./app/common/services/services";
import {App} from './app/app';

const PROVIDERS = [
    ...HTTP_PROVIDERS,
    ...FORM_PROVIDERS,
    ...ROUTER_PROVIDERS,
    ...APP_SERVICES_PROVIDERS
];

bootstrap(App, PROVIDERS)
    .then((appRef: ComponentRef) => {
        let storage: Storage = appRef.injector.get(Storage);
        let identity: IdentityService = appRef.injector.get(IdentityService);
        storage.initStorage(window.localStorage);
        storage.getItem("authorizationData").then((value) => {
            identity.update(JSON.parse(value));
        })
    }, error => console.log(error))
