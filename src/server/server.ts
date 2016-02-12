
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

let env = process.env.NODE_ENV || "development";
let app = express();

config
    .configure.for(env)
    .then(() => mongooseconfig.load.open())
    .then(() => redisconfig.open())
    .then(() => {
        configureExpress(app);
        configurePassport();
        configureRoutes(app);
        let port = nconf.get("httpPort") || 3000;
        app.listen(port);
        console.info(chalk.green(`Server started on http port:  ${port}`));
    })
    .catch((error) => {
        console.error(chalk.bgRed.white(`Crush ${error}`));
    });
