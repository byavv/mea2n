"use strict";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as nconf from "nconf";
import * as fs from "fs";

var GitHubStrategy = require("passport-github2").Strategy;
var User: any = mongoose.model("User");

export default function() {
    passport.use(
        new GitHubStrategy({
            clientID: nconf.get("github").clientID,
            clientSecret: nconf.get("github").clientSecret,
            callbackURL: nconf.get("github").callbackURL
        }, (accessToken, refreshToken, profile, done) => {
            process.nextTick(() => {
                User.findOne({ authProvider: "github", "extOAuth.providerData.id": profile.id }, (err, user) => {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();
                        newUser.authProvider = "github";
                        newUser.username = `${profile.username}`;
                        newUser.email = `github_${profile.emails[0].value}`;
                        newUser.imageUrl = profile._json.avatar_url;
                        newUser.extOAuth = {};
                        newUser.extOAuth.providerData = {
                            id: profile.id,
                            token: accessToken,
                            name: profile.username,
                            email: profile.emails[0].value,
                            profileUrl: profile.profileUrl
                        };
                        newUser.save((err) => {
                            if (err) {
                                return done(err)
                            } else {
                                return done(null, newUser);
                            }
                        });
                    }
                });
            });
        }));   
};
 