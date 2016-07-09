import * as path from "path";
import * as express from "express";
import * as morgan from "morgan";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import * as nconf from "nconf";
import * as session from "express-session";
import * as methodOverride from "method-override";
import { ensureSsl } from "../middleware";
import { expressEngine } from "angular2-universal";

export function configureExpress(app) {
    if (nconf.get("NODE_ENV") === "production") {
        app.use(ensureSsl);
    }
    app.use(require("serve-favicon")(path.join(__dirname, "../views/favicon.ico")));

    app.engine('.html', expressEngine);
    app.set("views", path.join(__dirname, "../../../build/client"));
    app.set('view engine', 'html');
   
    app.use(cookieParser());
    if (nconf.get("NODE_ENV") === "development") {
        app.use(morgan("tiny"));
    }

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride("_method"));
    app.use(passport.initialize());
    app.use("/static/", express.static(process.cwd() + "/build/client"));
    app.use((err: any, req: express.Request, res: express.Response, next: Function) => {
        let code = 500,
            msg = { message: "Internal Server Error" };
        switch (err.name) {
            case "UnauthorizedError":
                code = err.status;
                msg = undefined;
                break;
            case "BadRequestError":
            case "UnauthorizedAccessError":
            case "NotFoundError":
                code = err.status;
                msg = err.inner;
                break;
            default:
                break;
        }
        return res.status(code).json(msg);
    });
};

