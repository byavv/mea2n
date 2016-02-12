import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as async from 'async';
import * as _ from 'lodash';
import * as path from "path";
import * as express from 'express';

export default (User: any, tokenHelper: any)=>{

    return {
        /**
         * User registration
         * middleware for POST route: /auth/signup
         */
        signup: function(req, res) {
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

        },
        /**
         * User login api
         * middleware for POST route: /auth/signin
         */
        signin: function(req, res, next) {
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
        },
        /**
         * User log out api
         * middleware for POST route: /auth/signout
         */
        signout: function(req, res, next) {
            tokenHelper.revoke(req.user, (err, result) => {
                if (err) {
                    return res.status(500).send({ key: "error_500" });
                }
                return res.status(200).send("OK");
            });
        },
        /**
         * Check if user authorized for roles
         * middleware for POST route: /auth/me
         */
        me: function(req, res) {
            var roles = req.body.roles || '';
            if (_.intersection(req.user.roles, roles).length === roles.length) {
                return res.status(200).send("OK");
            } else {
                return res.status(401).send("NOT OK");
            }
        },
        /**
         * Passport external auth callback
         */
        oauthCallback: function(strategy) {
            return function(req, res: express.Response, next) {
                passport.authenticate(strategy, (err, user, redirectURL) => {
                    if (err || !user) {
                        return res.send("Unexpected server error");
                    }
                    tokenHelper.create(user, (err, identityData) => {
                        if (err) {
                            return res.redirect(redirectURL || '/');
                        }
                        res.send(`
                    <!doctype html>
                        <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <title>Angular 2 Universal Starter</title>
                                <link rel="icon" href="data:;base64,iVBORw0KGgo=">
                                <base href="/">
                            </head>
                            <body>
                            <script type="text/javascript">
                                var user = ${JSON.stringify(identityData)}     
                                if(!!user){
                                        window.focus();
                                        if (window.opener && window.opener != window.self) {
                                            window.opener.focus();
                                            localStorage.setItem('authorizationData', JSON.stringify(user)); 
                                            window.close();
                                        } else {       
                                            localStorage.setItem('authorizationData', JSON.stringify(user));
                                            location.href = "/";      
                                        }
                                    } else {
                                        location.href = "/error";//todo
                                    }
                                </script>
                            </body>
                        </html>                    
                    `)
                });
            })(req, res, next);}
        }
    }
}