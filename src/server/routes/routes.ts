import {ng2engine, REQUEST_URL, SERVER_LOCATION_PROVIDERS} from 'angular2-universal-preview';
import {provide, enableProdMode} from 'angular2/core';
import {APP_BASE_HREF, ROUTER_PROVIDERS} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';
import {APP_SERVICES_PROVIDERS} from "../../client/app/common/services/services";
import {HTTP_PROVIDERS} from 'angular2/http';
import {App} from '../../client/app/app';
import * as nconf from 'nconf';
import userRoutes from "./user.routes";
import * as express from 'express';

const APP_PROVIDERS = [
    ...ROUTER_PROVIDERS,
    ...SERVER_LOCATION_PROVIDERS,
    ...HTTP_PROVIDERS,
    ...FORM_PROVIDERS,
    ...APP_SERVICES_PROVIDERS
];

export function configureRoutes(app) {
    userRoutes(app);
    if (nconf.get("NODE_ENV") === "production") {
        enableProdMode();
    }
    function ngApp(req: express.Request, res: express.Response) {
        let baseUrl = '/';
        let url = req.originalUrl || '/';
        res.render('index', {
            App,
            providers: [
                provide(APP_BASE_HREF, { useValue: baseUrl }),
                provide(REQUEST_URL, { useValue: url }),
                ...APP_PROVIDERS
            ],
            preboot: true
        });
    }
    app.use('/', ngApp);
};
