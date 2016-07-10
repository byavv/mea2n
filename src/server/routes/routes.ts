import 'angular2-universal/polyfills';
import { Http } from '@angular/http';
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
// Server rendered component
import { Footer } from '../views/components/footer';
// Application routes
import { APP_ROUTER_PROVIDERS } from '../../client/app/routes';
import { APP_SERVICES_PROVIDERS  } from "../../client/app/shared/services";

// Disable Angular 2's "development mode".
// See: https://angular.io/docs/ts/latest/api/core/enableProdMode-function.html
enableProdMode();

export function configureRoutes(app) {
    userRoutes(app);
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
                ...NODE_LOCATION_PROVIDERS,
                
                APP_SERVICES_PROVIDERS,
                APP_ROUTER_PROVIDERS,

                provide(REQUEST_URL, { useValue: url }),
                provide(TranslateLoader, {
                    useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
                    deps: [Http]
                })
            ],
            preboot: {
                appRoot: 'app',          // selector for Angular root element
                replay: 'rerender',      // Angular will re-render the view
                freeze: 'spinner',       // show spinner w button click & freeze page
                focus: true,             // maintain focus after re-rendering
                buffer: true,            // client app will write to hidden div until bootstrap complete
                keyPress: true,          // all keystrokes in text elements recorded
                buttonPress: true        // when button pressed, record and freeze page          
            },
            async: true
        });
    };
    app.use('/', ngApp);
};
