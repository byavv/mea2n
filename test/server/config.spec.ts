import {mongooseconfig} from "../../src/server/config/mongoose_conf";
import * as mongoose from "mongoose";
import * as chalk from "chalk";
import {config} from "../../src/server/config/config";
var User;
/**
 * Global before, after blocks
 */
before((done) => {
    config.configure.for("test").then(() => {
        done();
    }, (err) => {
        console.error("Error config: " + err);
        done(err);
    });
});
before(() => {
    mongooseconfig.load.open();
    User = mongoose.model("User");
});
after((done) => {
    User.remove({}, () => {
        console.log(chalk.green("Test database cleaned"));       
        mongooseconfig.close((err) => {
            if (err) {
                console.log(err);
            }
            done();
        })
    });
})