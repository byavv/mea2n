/*jslint node: true */
'use strict';

/**
 * Usage:
 * gulp [task] --env development
 */

const gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    webpack = require('webpack'),
    path = require('path'),
    runSequence = require('run-sequence'),
    chalk = require('chalk'),
    nodemon = require('gulp-nodemon'),
    webdriver = require('gulp-protractor').webdriver_update,
    del = require('del'),
    minimist = require('minimist'),
    rx = require("rxjs");

const config = require("./gulpConfig");

const defaults = {
    string: ['env'],
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};
const options = minimist(process.argv.slice(2), defaults);
process.env.NODE_ENV = options.env;

gulp.task("compile:tests", ['set_test'], (done) => {
    let config = require("./config/webpack.server")
    webpack(config).run(onWebpackCompleted(done));
});

gulp.task('test:server', ["compile:tests"], () => {
    let mochaError;
    gulp.src(['./test/**/*.spec.js'], { read: false })
        .pipe($.mocha(config.options.mocha))
        .on('error', (err) => {
            mochaError = err;
        })
        .on('end', () => {
            if (mochaError) {
                $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(mochaError.message));
                process.exit(1);
            }
            $.util.log($.util.colors.white.bgGreen.bold('INFO:'), 'Mocha completed');
            process.exit();
        });
});

gulp.task("set_test", () => {
    process.env.NODE_ENV = 'test';
})

gulp.task("test", ['set_test', 'test:client'], (done) => {
    runSequence(['test:server'], done)
});

gulp.task("test:client", ['set_test'], (done) => {
    startClientTests(true, done);
});

gulp.task("test:client:watch", ['set_test'], (done) => {
    startClientTests(false, done);
});

gulp.task('clean:all', () => {
    del.sync(['build/**', ".tmp/**"]);
});

gulp.task('clean:server', () => {
    del.sync(['build/server/**']);
});
gulp.task('clean:client', () => {
    del.sync(['build/client/**']);
});

gulp.task("build:server", ['clean:server'], (done) => {
    let config = require("./config/webpack.server");
    webpack(config).run(onWebpackCompleted(done));
});

gulp.task("build:client", ['clean:client'], (done) => {
    let config = require("./config/webpack.client");
    webpack(config).run(onWebpackCompleted(done));
});

gulp.task("build", ["build:client"], (done) => {
    runSequence(['build:server'], done)
});

gulp.task('default', ["clean:all"], () => {
    let nodemonRef;
    let configServer = require("./config/webpack.server");
    let configClient = require("./config/webpack.client");
    rx.Observable.create((observer) => {
        webpack(configClient).watch(500, onWebpackCompleted((err) => {
            if (err) observer.error(err);
            observer.next();
        }));
        webpack(configServer).watch(500, onWebpackCompleted((err) => {
            if (err) observer.error(err);
            observer.next();
        }));
    })
        .skip(1)
        .subscribe(() => {
            nodemonRef
                ? nodemonRef.restart()
                : nodemonRef = nodemon({
                    script: path.join(__dirname, 'build/server/server.js'),
                });
        })
});

gulp.task('test:compile:e2e', (done) => {
    let project = $.typescript.createProject({
        declaration: true,
        noExternalResolve: true,
        suppressImplicitAnyIndexErrors: true
    })
    gulp.src([path.join(__dirname, 'src/client/**/*.e2e.ts')])
        .pipe($.typescript(project, undefined, $.typescript.reporter.nullReporter())).js
        .pipe(gulp.dest(config.dirs.temp))
        .on('end', done)
})

gulp.task('test:update:webdriver', ['test:compile:e2e'], (done) => {
    $.protractor.webdriver_update({}, done)
})

gulp.task('test:e2e', ['test:update:webdriver'], () => {
    gulp.src(path.join(__dirname, '.tmp/**/*.e2e.js'))
        .pipe($.protractor.protractor(config.options.protractor))
        .on('error', e => {
            del([config.dirs.temp])
        })
        .on('end', () => {
            del([config.dirs.temp])
        });
});

function startClientTests(single, done) {
    single = single || false;
    let Server = require("karma").Server;
    let server = new Server({
        configFile: path.join(__dirname, "/karma.conf.js"),
        singleRun: single,
        autoWatch: !single
    }, (res) => {
        if (res === 1) {
            $.util.log($.util.colors.white.bgRed.bold("KARMA FAIL!"));
            process.exit(res)
        } else {
            $.util.log($.util.colors.white.bgGreen.bold('INFO:'), 'Karma completed');
        }
        done();
    });
    server.start();
}

function onWebpackCompleted(done) {
    return (err, stats) => {
        if (err) {
            $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(err));
        } else {
            var stat = stats.toString({ chunks: false, colors: true });
            console.log(stat + '\n');
        }
        if (done) {
            done(err);
        }
    }
}
