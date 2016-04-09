import {
    expressEngine,
    REQUEST_URL,
    NODE_ROUTER_PROVIDERS,
    NODE_HTTP_PROVIDERS
} from 'angular2-universal';

import {provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';
import {APP_SERVICES_PROVIDERS} from "../../client/app/common/services/services";
import {HTTP_PROVIDERS} from 'angular2/http';
import {App} from '../../client/app/app';
import * as nconf from 'nconf';
import userRoutes from "./user.routes";
import * as express from 'express';

const APP_PROVIDERS = [
    ...APP_SERVICES_PROVIDERS
];

export function configureRoutes(app) {
    userRoutes(app);
    if (nconf.get("NODE_ENV") === "production") {
        enableProdMode();
    }
    function ngApp(req, res) {
        let baseUrl = '/';
        let url = req.originalUrl || '/';
        res.render('index', {
            directives: [],
            providers: [
                provide(APP_BASE_HREF, { useValue: baseUrl }),
                provide(REQUEST_URL, { useValue: url }),
                NODE_ROUTER_PROVIDERS,
                NODE_HTTP_PROVIDERS,
                ...APP_PROVIDERS
            ],
            async: true,
            preboot: false // { appRoot: 'app' } // your top level app component selector
        });
    }
    app.use('/', ngApp);
};
