import * as sinon from "sinon";
import * as express from "express";
import * as chai from "chai";
import * as request from "supertest";
import {configureExpress} from "../../../src/server/config/express_conf";
import auth from "../../../src/server/controllers/user.auth.controller";
var assert = chai.assert;
var expect = chai.expect;
describe("User authentication controller unit tests", () => {
    var app;
    var User;
    var JwtUtilStub, createStub, revokeStub;
    var findOneStub, saveStub;
    var controller;
    var user_to_find;
    before(() => {
        user_to_find = {
            _id: "123456789",
            authenticate: sinon.stub().returns(true)
        }
        findOneStub = sinon.stub().yields(null, user_to_find);
        saveStub = sinon.stub().yields(null, { _id: "0254879456" });
        User = function() {
            this.save = saveStub;
        };
        User.findOne = findOneStub;
        createStub = sinon.stub().yields(null, { token: "0254879456" });
        revokeStub = sinon.stub().yields(null);
        JwtUtilStub = {
            create: createStub,
            revoke: revokeStub
        }
        controller = auth(User, JwtUtilStub);
    })
    before(() => {
        app = express();
        configureExpress(app);
        app.use("/me", (req, res, next) => {
            req.user = { roles: ["user"] }
            next();
        });
        app.post('/signup', controller.signup);
        app.post('/signout', controller.signout);
        app.post('/signin', controller.signin);
        app.post('/me', controller.me);
    });
    describe("Sign in user", () => {
        afterEach(() => {
            findOneStub.reset();
        })
        it("Should sign in successfully", (done) => {
            var user_to_signin = { username: 'marcus', password: '123456789' };
            request(app)
                .post('/signin')
                .send(user_to_signin)
                .expect(200)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(findOneStub.called).to.be.equal(true);
                    expect(createStub.called).to.be.equal(true);
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.equal("0254879456");
                    done();
                });
        })
        it("Should fail to sign in without password", (done) => {
            var user_to_signin = { username: 'marcus' };
            request(app)
                .post('/signin')
                .send(user_to_signin)
                .expect(400)
                .end((err, res) => {
                    expect(res.status).to.be.equal(400);
                    expect(res.body).to.have.property('key');
                    expect(res.body.key).to.be.equal("error_notValidCredentials");
                    done();
                });
        })
        it("Should fail to sign in if MongoDB returns error", (done) => {
            findOneStub.yields(new Error("mongoerror"), null);
            var user_to_signin = { username: 'marcus', password: "12345678" };

            request(app)
                .post('/signin')
                .send(user_to_signin)
                .expect(500)
                .end((err, res) => {
                    expect(res.status).to.be.equal(500);
                    expect(res.body).to.have.property('key');
                    expect(res.body.key).to.be.equal("error_500");
                    expect(res.body.message).to.be.equal("mongoerror");
                    done();
                });
        })
        it("Should fail to sign in if error creating a token occurs", (done) => {
            findOneStub.yields(null, user_to_find);
            createStub.yields(new Error("tokenerror"), null);

            var user_to_signin = { username: 'marcus', password: "12345678" };
            request(app)
                .post('/signin')
                .send(user_to_signin)
                .expect(500)
                .end((err, res) => {
                    expect(res.status).to.be.equal(500);
                    expect(res.body).to.have.property('key');
                    expect(res.body.key).to.be.equal("error_500");
                    expect(res.body.message).to.be.equal("tokenerror");
                    done();
                });
        })
        it("Should fail to sign in if authentication does not pass", (done) => {
            user_to_find = {
                authenticate: () => {
                    return false;
                }
            }
            findOneStub.yields(null, user_to_find);
            createStub.yields(null, null);

            var user_to_signin = { username: 'marcus', password: "12345678" };
            request(app)
                .post('/signin')
                .send(user_to_signin)
                .expect(400)
                .end((err, res) => {
                    expect(res.status).to.be.equal(400);
                    done();
                });
        })
    })
    describe("Sign up user", () => {
        it("Should sign up without problems", (done) => {
            var user_to_signin = { username: 'marcus', password: '123456789', email: "john@doe.com" };
            createStub.yields(null, { token: "0254879456" });
            request(app)
                .post('/signup')
                .send(user_to_signin)
                .expect(200)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(createStub.called).to.be.equal(true);
                    expect(res.body).to.have.property('token');
                    expect(res.body.token).to.be.equal("0254879456");
                    done();
                });
        })
        it("Should get errors from list", (done) => {
            var user_to_signin = { username: 'marcus', password: '123456789', email: "john@doe.com" };
            saveStub.yields({ name: "ValidationError", errors: [{ message: "error1" }, { message: "error2" }] }, null);

            request(app)
                .post('/signup')
                .send(user_to_signin)
                .expect(400)
                .end((err, res) => {
                    expect(res.status).to.be.equal(400);
                    expect(res.body).to.to.have.property("key");
                    expect(res.body.message).to.to.have.length(2);
                    expect(createStub.called).to.be.equal(true);
                    done();
                });
        });
    });
    describe("Sign out user", () => {
        it("Should get errors from list", (done) => {
            request(app)
                .post('/signout')
                .expect(200)
                .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.text).to.be.equal("OK");
                    expect(revokeStub.called).to.be.equal(true);
                    done();
                });
        });
    })
    describe("Check user auth ", () => {
        it("Should check authorization success", (done) => {
            request(app)
                .post('/me')
                .send({ roles: ["user"] })              
                .expect((err, res) => {
                    expect(res.body.status).to.be.equal(200);
                    expect(res.body.text).to.be.equal("OK");
                    expect(revokeStub.called).to.be.equal(true);
                }).end(() => done());
        });
        it("Should check authorization fail (check if user admin)", (done) => {
            request(app)
                .post('/me')
                .send({ roles: ["user", "admin"] })//if user has these roles, should pass, but it don't
                .expect(401)
                .end((err, res) => {
                    expect(res.status).to.be.equal(401);
                    done();
                });
        });
    });
})
