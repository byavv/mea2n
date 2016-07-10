import 'angular2-universal/polyfills';

import { provide, PLATFORM_DIRECTIVES, ComponentRef } from '@angular/core';
import { Http } from '@angular/http';
import { APP_SERVICES_PROVIDERS, IdentityService, Storage } from "./app/shared/services";
import { InertLink } from "./app/shared/directives";
import { APP_ROUTER_PROVIDERS } from './app/routes';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

import {
    TranslateLoader,
    TranslateStaticLoader,
    TranslateService
} from "ng2-translate/ng2-translate";
import { prebootComplete } from 'angular2-universal';
import { bootstrap, enableProdMode, BROWSER_ROUTER_PROVIDERS, BROWSER_HTTP_PROVIDERS } from 'angular2-universal';

import { App } from './app/app';

const PROVIDERS = [
    ...BROWSER_HTTP_PROVIDERS,
    ...BROWSER_ROUTER_PROVIDERS,
    APP_SERVICES_PROVIDERS,
    APP_ROUTER_PROVIDERS,
    provide(TranslateLoader, {
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
        deps: [Http]
    }),
    provide(PLATFORM_DIRECTIVES, { useValue: InertLink, multi: true }),
    disableDeprecatedForms(),
    provideForms(),
];

enableProdMode();

bootstrap(App, PROVIDERS)
    .then(prebootComplete)
    .catch(console.error)
