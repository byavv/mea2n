"use strict";
import * as path from "path";
import * as chalk from "chalk";
import * as fs from "fs";
import * as nconf from "nconf";
import { defaults } from "./defaults";
import * as configs from "./env";

/**
 * Create app configuration
 */
export var config = {
    // environment specific options
    for: (env) => {
        env = env.toLowerCase().trim();
        return new Promise((resolve, reject) => {
            nconf.overrides(configs[env]);
            // do some async stuff if needed           
            resolve();
        });
    },
    // not chengable options
    get configure() {
        nconf.argv().env();
        nconf.defaults(defaults);
        nconf.file("app", {
            file: 'config.json',
            dir: __dirname,
            search: true
        });
        return this;
    }
};  
