import * as sinon from "sinon";
import * as express from "express";
import * as chai from "chai";
import * as mongoose from "mongoose";
var assert = chai.assert;
var expect = chai.expect;
chai.should();

describe("User model methods & validation tests", () => {
    var User;
    var user;
    before((done) => {
        User = mongoose.model("User");
        user = new User();
        done();
    })

    describe("User model", () => {
        afterEach(() => {
            User.remove({}).exec();
        })

        it('Should begin with clean db', (done) => {
            User.find({}, (err, users) => {
                users.should.have.length(0);
                done(err);
            });
        });
        it("Should have defaults", () => {
            assert(user);
            expect(user).have.property('roles').to.have.length(1);
            expect(user).have.property('username').to.be.equal('');
            expect(user).have.property('email').to.be.equal('');
            expect(user).have.property('created').to.be.an('Date');
            expect(user).have.property('authProvider').to.be.equal('local');
        });
        it("Should fail to save empty object", (done) => {
            user.save((err, res) => {
                assert(err);
                done();
            })
        });
        it("Should be authenticated, also after update (change user scenario)", (done) => {
            var password = "123456789"
            user = new User({
                username: "John Doe",
                password: password,
                email: "john@doe.com"
            });
            user.save((err, res) => {
                expect(user.authenticate(password)).to.equal(true);
                user.username = "Megan Doe";
                user.password = password;
                user.save((err, res) => {
                    expect(user.authenticate(password)).to.equal(true);
                    done();
                })
            })
        });

        describe("User Validation", () => {
            describe("Username", () => {
                it("Should fail saving and fire validation error with empty username when local provider", (done) => {
                    user = new User({
                        authProvider: "local",
                        username: ""
                    });
                    user.save((err, res) => {
                        expect(err.errors).have.property("username");
                        done();
                    });
                });
                it("Should save user with empty username if github provider", (done) => {
                    user = new User({
                        authProvider: "github",
                        username: ""
                    });
                    user.save((err, res) => {
                        expect(res).have.property("authProvider").to.be.equal("github");
                        done();
                    });
                });
                it('Should fail to save if user with the same username is already registered', function(done) {
                    var user1 = new User({
                        username: "test",
                        email: "ber@gog.com",
                        password: "qwerty123456"
                    });
                    var user2 = new User({
                        username: "test",
                        email: "ber@gog.com",
                        password: "qwerty123456"
                    });
                    user1.save(() => {
                        user2.save((err) => {
                            expect(err.errors).have.property("username");
                            done();
                        });
                    });
                });
            });

            describe("Email", () => {
                it("Should fail saving and fire email validation error, if email is empty", (done) => {
                    user = new User({
                        authProvider: "local",
                        username: "John Doe"
                    });
                    user.save((err, res) => {
                        expect(err.errors).have.property("email");
                        done();
                    });
                });
                it("Should fail saving and fire email validation error, try: wrong_email", (done) => {
                    user = new User({
                        authProvider: "local",
                        username: "John Doe",
                        email: "wrong_email"
                    });
                    user.save((err, res) => {
                        expect(err.errors).have.property("email");
                        done();
                    });
                });
                it("Should fail saving and fire email validation error, try: b@", (done) => {
                    user = new User({
                        authProvider: "local",
                        username: "John Doe",
                        email: "b@"
                    });
                    user.save((err, res) => {
                        expect(err.errors).have.property("email");
                        done();
                    });
                });
                it("Should fail saving and fire email validation error, try: ffff@gog", (done) => {
                    user = new User({
                        authProvider: "local",
                        username: "John Doe",
                        email: "ff.ff@gog"
                    });
                    user.save((err, res) => {
                        expect(err.errors).have.property("email");
                        done();
                    });
                });
                it("Should save successfully, try: ber@gog.com", (done) => {
                    user = new User({
                        authProvider: "local",
                        username: "John Doe",
                        email: "ber@gog.com"
                    });
                    user.save((err, res) => {
                        expect(err.errors).not.have.property("email");
                        done();
                    });
                });
            });
            describe("Password", () => {
                it("Should fail saving and fire password validation error, if password is empty", (done) => {
                    user = new User({
                        username: "John Doe",
                        email: "mean@mean.com"
                    });
                    user.save((err, res) => {
                        expect(err.errors).have.property("password");
                        done();
                    });
                });
                it("Should fail saving and fire password validation error, if password is not strong enouph", (done) => {
                    user = new User({
                        username: "John Doe",
                        email: "mean@mean.com",
                        password: "11111"
                    });
                    user.save((err, res) => {
                        expect(err.errors).have.property("password");
                        done();
                    });
                });
                it("Should pass if password is longer then 6", (done) => {
                    user = new User({
                        username: "John Doe",
                        email: "mean@mean.com",
                        password: "111111"
                    });
                    user.save((err, res) => {
                        expect(res).have.property("username").equal("John Doe");
                        done();
                    });
                });
            })
        });
    })
});