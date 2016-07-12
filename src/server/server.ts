import 'angular2-universal/polyfills';

import * as express from "express";
import {config} from "./config/config";
import {mongooseconfig} from "./config/mongoose_conf";
import {configureExpress} from "./config/express_conf";
import {configureRoutes} from "./routes/routes";
import configurePassport from "./config/passport_conf";
import {redisconfig} from "./config/redis_conf";

import * as nconf from "nconf";
import * as chalk from "chalk";
import * as path from "path";
import * as fs from "fs";
import * as https from "https";

const env = process.env.NODE_ENV || "development";
const app = express();

config
    .configure.for(env)
    .then(() => mongooseconfig.load.open())
    .then(() => redisconfig.open())
    .then(() => {
        configureExpress(app);
        configurePassport();
        configureRoutes(app);
        // node dist/server/server.js --SECURED 
        // if you need to run locally in https mode
        if (nconf.get("SECURED")) {
            const privateKey = fs.readFileSync(path.join(__dirname, './config/ssl/testkey.pem'), 'utf8');
            const certificate = fs.readFileSync(path.join(__dirname, './config/ssl/testcert.pem'), 'utf8');
            const httpsPort = nconf.get("httpsPort") || 443;
            const httpsServer = https.createServer({
                key: privateKey,
                cert: certificate
            }, app);
            httpsServer.listen(httpsPort);
            console.info(chalk.green(`Server started on https port:  ${httpsPort}`));
        } else {
            let httpPort = nconf.get("httpPort") || 3000;
            app.listen(httpPort);
            console.info(chalk.green(`Server started on http port:  ${httpPort}`));
        }
    })
    .catch((error) => {
        console.error(chalk.bgRed.white(`Crush ${error}`));
    });
