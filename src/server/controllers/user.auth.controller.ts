import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as async from 'async';
import * as _ from 'lodash';
import * as path from "path";
import * as express from 'express';
import * as fs from 'fs';

export function authController(User: any, tokenHelper: any) {
    /**
     * User registration
     * middleware for POST route: /auth/signup
     */
    function signup(req, res) {
        var user = new User(req.body);
        user.authProvider = "local";
        try {
            user.save((err) => {
                if (err) {
                    var validationErrList = [];
                    if (err.name === "ValidationError" && err.errors) {
                        validationErrList = _.values(err.errors)
                            .map((validationError: any) => {
                                return validationError.message;
                            });
                        return res.status(400).send({
                            key: "error_validation",
                            message: validationErrList
                        });
                    } else {
                        return res.status(500).send({ key: "error_500", message: err.message });
                    }
                } else {
                    tokenHelper.create(user, (err, result) => {
                        if (err) {
                            return res.status(500).send({ key: "error_500", message: err.message });
                        }
                        return res.status(200).json(result);
                    });
                }
            });
        } catch (error) {
            return res.status(500).send({ key: "error_500" });
        }
    }
    /**
     * User login api
     * middleware for POST route: /auth/signin
     */
    function signin(req, res, next) {
        let {username, password} = req.body;
        if (!!username && !!password) {
            User.findOne({ username: username }, (err, user) => {
                if (err) return res.status(500).send({ key: "error_500", message: err.message });
                if (!!user && user.authenticate(password)) {
                    tokenHelper.create(user, (err, result) => {
                        if (err) {
                            return res.status(500).send({ key: "error_500", message: err.message });
                        }
                        return res.status(200).json(result);
                    });
                } else {
                    return res.status(400).send({ key: 'error_notValidCredentials' });
                }
            })
        } else {
            return res.status(400).send({ key: 'error_notValidCredentials' });
        }
    }
    /**
     * User log out api
     * middleware for POST route: /auth/signout
     */
    function signout(req, res, next) {
        tokenHelper.revoke(req.user, (err, result) => {
            if (err) {
                return res.status(500).send({ key: "error_500" });
            }
            return res.status(200).send("OK");
        });
    }
    /**
     * Check if user authorized for roles
     * middleware for POST route: /auth/me
     */
    function me(req, res) {
        var roles = req.body.roles || '';
        if (_.intersection(req.user.roles, roles).length === roles.length) {
            return res.status(200).send(true);
        } else {
            return res.sendStatus(401);
        }
    }
    /**
     * Passport external auth callback
     */
    function oauthCallback(strategy) {
        return function(req, res: express.Response, next) {
            passport.authenticate(strategy, (err, user, redirectURL) => {
                if (err || !user) {
                    console.error(err)
                    return res.send("Unexpected server error");
                }
                tokenHelper.create(user, (err, identityData) => {
                    if (err) {
                        console.error(err)
                        return res.redirect(redirectURL || '/');
                    }
                    fs.readFile(path.join(__dirname, '../views/auth_success.html'), 'utf8', (err, data) => {
                        if (err) {
                            console.error(err)
                            return res.redirect(redirectURL || '/');
                        }
                        let jsrender = require("jsrender");
                        jsrender.templates({ tmpl: data });
                        var html = jsrender.render.tmpl({
                            identityData: JSON.stringify(identityData)
                        })
                        res.writeHead(200, { "content-type": 'text/html' });
                        res.write(html);
                        res.end();
                    });
                });
            })(req, res, next);
        }
    }

    return {
        signup: signup,
        signin: signin,
        signout: signout,
        me: me,
        oauthCallback: oauthCallback
    }
}
