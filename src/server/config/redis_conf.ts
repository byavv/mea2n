"use strict";
import * as redis from "redis";
import * as chalk from "chalk";
import * as nconf from "nconf";

var _client: redis.RedisClient;
/**
 * Configure mongoose
 */
export var redisconfig: any = {
    open: () => {
        return new Promise((resolve, reject) => {
            _client = redis.createClient(nconf.get("redis"));
            _client
                .on("error", (err) => {
                    console.error(chalk.red("Redis connection crushed!"));
                    console.log(err);
                    throw err;
                })
                .once("ready", () => {
                    console.log(chalk.green("Connected to Redis..."));
                    resolve()
                });
        })
    },
    close: () => {
        _client.end();
    },
    get client(): redis.RedisClient {
        return _client;
    },
    set client(value) {
        _client = value;
    }
};
