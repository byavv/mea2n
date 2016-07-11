import 'angular2-universal/polyfills';
import { Http } from '@angular/http';
import { provideRouter } from "@angular/router";
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { PLATFORM_DIRECTIVES } from '@angular/core';
import {
    provide,
    enableProdMode,
    expressEngine,
    REQUEST_URL,
    ORIGIN_URL,
    BASE_URL,
    NODE_ROUTER_PROVIDERS,
    NODE_LOCATION_PROVIDERS,
    NODE_PLATFORM_PIPES,
    NODE_HTTP_PROVIDERS,
    NODE_PRELOAD_CACHE_HTTP_PROVIDERS
} from 'angular2-universal';

import {
    TranslateService,
    TranslateLoader,
    TranslateStaticLoader
} from "ng2-translate/ng2-translate";
// Server api routes
import userRoutes  from './user.routes';
// Root app component
import { App } from '../../client/app/app';
// Directives to use globally
import { InertLink } from '../../client/app/shared/directives';
// Server rendered component
import { Footer } from '../views/components/footer';
// Application routes
import { APP_ROUTER_PROVIDERS, routes } from '../../client/app/routes';
import { APP_SERVICES_PROVIDERS  } from "../../client/app/shared/services";

// Disable Angular 2's "development mode".
// See: https://angular.io/docs/ts/latest/api/core/enableProdMode-function.html
enableProdMode();

export function configureRoutes(app) {
    userRoutes(app);
    app.get('/app/defaults', (req, res) => {       
        res.status(200).send({
            some: 'defaultValue'
        })
    });
    const origin_url = process.env.ORIGIN_URL || 'http://localhost:3030';
    function ngApp(req, res) {
        let baseUrl = '/';
        let url = req.originalUrl || '/';
        res.render('index', {
            directives: [App, Footer],
            platformProviders: [
                provide(ORIGIN_URL, { useValue: origin_url }),
                provide(BASE_URL, { useValue: baseUrl }),
            ],
            providers: [
                ...NODE_HTTP_PROVIDERS,
                ...NODE_PLATFORM_PIPES,

                ...APP_SERVICES_PROVIDERS,
                ...APP_ROUTER_PROVIDERS,

                provide(REQUEST_URL, { useValue: url }),
                ...NODE_LOCATION_PROVIDERS,

                provide(PLATFORM_DIRECTIVES, { useValue: InertLink, multi: true }),

                provide(TranslateLoader, {
                    useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
                    deps: [Http]
                }),

                disableDeprecatedForms(),
                provideForms(),
            ],
            preboot: false,
            async: true
        });
    };
    app.use('/', ngApp);
    app.use('/auth*', ngApp);
    app.use('/user*', ngApp);
    app.use('/restricted*', ngApp);
};
