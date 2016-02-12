"use strict";
import * as mongoose from "mongoose";
import * as path from "path";
import * as chalk from "chalk";
import * as nconf from "nconf";
import * as fs from "fs";
import * as models from "../models";

/**
 * Configure mongoose
 */
export var mongooseconfig: any = {
    open: () => {
        return new Promise((resolve, reject) => {
            mongoose.connect(nconf.get("db"), (err) => {
                if (err) {
                    console.error(chalk.red("MongoDB connection crushed!"));
                    console.log(err);
                    reject(err)
                } else {
                    console.log(chalk.green("Connected to MongoDB..."));
                    resolve()
                }
            });
            let db = mongoose.connection;
            db.on("error", (err) => {
               // log here
               throw err;
            });            
            db.on("disconnecting", () => {
                console.info(chalk.yellow("Disconnected from MongoDB."));
            })
        })
    },
    close: (done) => {
        mongoose.disconnect(err=> {
            done(err)
        });
    },
    get load() {
        Object.keys(models).forEach((name) => {
            console.info(`     ${chalk.grey(name)}`);
        });
        return this;
    }
};