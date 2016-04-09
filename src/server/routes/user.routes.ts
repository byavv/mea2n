'use strict';
import * as passport from "passport";
import * as nconf from "nconf";
import * as express from "express";
import * as mongoose from "mongoose";
import tokenHelper from "../libs/jwt.util";
import {authController, apiController} from "../controllers/";
import {redisconfig} from "../config/redis_conf";
import {sendResetMail} from "../libs/mail.helper";
var jwt = require('express-jwt');
var User = mongoose.model("User");

export default function(app: express.Application) {
    
    var _tokenHelper = tokenHelper(redisconfig.client);
    var _authCtrl = authController(User, _tokenHelper);
    var _apiCtrl = apiController(User, sendResetMail);    
    /**
     *  User profile api  
     */
    app.route('/api/profile').post(jwt({
        secret: nconf.get("jwtAuth").secret,
        isRevoked: _tokenHelper.isRevoked
    }), _apiCtrl.postProfile);

    app.route('/api/profile').put(jwt({
        secret: nconf.get("jwtAuth").secret,
        isRevoked: _tokenHelper.isRevoked
    }), _apiCtrl.updateProfile);

    app.route("/api/account").post(jwt({
        secret: nconf.get("jwtAuth").secret,
        isRevoked: _tokenHelper.isRevoked
    }), _apiCtrl.postAccount);

    app.route('/api/updateaccount').post(jwt({
        secret: nconf.get("jwtAuth").secret,
        isRevoked: _tokenHelper.isRevoked
    }), _apiCtrl.updateAccount);

    app.route('/api/forgot').post(_apiCtrl.forgot);
    app.route('/api/resetpassword/').post(_apiCtrl.setNewPassword);
    app.route('/api/reset/:token').get(_apiCtrl.validateResetToken);
    /**
     * Local authentication api
     */
    app.route('/auth/signup').post(_authCtrl.signup);
    app.route('/auth/signin').post(_authCtrl.signin);
    app.route('/auth/signout').post(jwt({
        secret: nconf.get("jwtAuth").secret,
        isRevoked: _tokenHelper.isRevoked
    }), _authCtrl.signout);
    app.route('/auth/me').post(jwt({
        secret: nconf.get("jwtAuth").secret,
        isRevoked: _tokenHelper.isRevoked
    }), _authCtrl.me);
    /**
     * Github authentication routes 
     */
    app.route('/external/github').get(passport.authenticate('github', {
        scope: ['user:email']
    }));
    app.route('/external/github/callback').get(_authCtrl.oauthCallback('github'));
};