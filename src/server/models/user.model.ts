"use strict";
import * as mongoose from "mongoose";
import * as crypto from "crypto";

var validate = require("mongoose-validator"),
    uniqueValidatorPlugin = require("mongoose-unique-validator"),
    Schema = mongoose.Schema

var validateLocalStrategyProperty = function(value) {
    return (this.authProvider !== "local" || (value && value.length > 0));
};

var validateLocalStrategyEmail = function(value) {
    return (this.authProvider !== "local" || (/.+\@.+\..+/.test(value)));
};

var validateLocalStrategyPassword = function(password) {
    return (this.authProvider !== "local" || (password && password.length > 5));
};

var emailValidator = [
    validate({
        validator: validateLocalStrategyEmail,
        message: "{VALUE} is not a valid e-mail address!"
    }),
    validate({
        validator: validateLocalStrategyProperty,
        message: "Please fill in your email."
    })
];

var usernameValidator = validate({
    validator: validateLocalStrategyProperty,
    message: "Please fill in your name."
});

var passwordValidator = validate({
    validator: validateLocalStrategyPassword,
    message: "Password length should be not less then 6"
});

var UserSchema: any = new Schema({
    email: {
        type: String,
        trim: true,
        default: "",
        validate: emailValidator,
        set: function(value) {
            return value.toLowerCase();
        },
        unique: "User with email: {VALUE} is already exists"
    },
    username: {
        type: String,
        trim: true,
        default: "",
        validate: usernameValidator,
        unique: "Username {VALUE} is already exists"
    },
    password: {
        type: String,
        default: "",
        validate: passwordValidator
    },
    salt: { type: String },
    imageUrl: { type: String },
    authProvider: {
        type: String,
        default: "local"
    },
    extOAuth: {
        providerData: {}
    },
    profile: {
        name: String,
        address: String,
        birthday: Date
    },
    roles: {
        type: [{
            type: String,
            enum: ["user", "admin"]
        }],
        default: ["user"]
    },
    created: { type: Date, default: Date.now },
    resetData: {
        token: { type: String },
        expires: { type: Date }
    }
});

UserSchema.plugin(uniqueValidatorPlugin);

/**
 * Hash password before save
 */
UserSchema.pre("save", function(next) {
    this.salt = new Buffer(crypto.randomBytes(16).toString("base64"), "base64");
    this.password = this.hashPassword(this.password);
    next();
});

/**
 *  Instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString("base64");
    } else {
        return password;
    }
};

/**
 *  Instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

export var userModel = mongoose.model("User", UserSchema)
