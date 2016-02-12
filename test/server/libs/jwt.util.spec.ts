import * as sinon from "sinon";
import * as express from "express";
import * as chai from "chai";
import * as request from "supertest";
import jwtFactory from "../../../src/server/libs/jwt.util"
var assert = chai.assert;
var expect = chai.expect;

describe('JWT util tests', () => {
    var jwtHelper,
        setexStub,
        expireStub;
    before((done) => {
        let mockRedisClient: any = {};
        setexStub = sinon.stub().yields(null);
        expireStub = sinon.stub().yields(null, "fake_token_replyed_by_redis");
        mockRedisClient.setex = setexStub;
        mockRedisClient.expire = expireStub;
        jwtHelper = jwtFactory(mockRedisClient);
        done();
    });
    it('Should create new ', (done) => {
        let user = { _id: "fakeid1", roles: ["user"] }
        jwtHelper.create(user, (err, clientdata) => {
            expect(err).to.be.null;
            expect(clientdata).to.have.property("token");
            expect(clientdata.token).to.be.an("String");
            done();
        });
    });
    it("Should revoke user authentication", (done) => {
        let payload = { id: "fakeid1", roles: ["user"] }
        jwtHelper.revoke(payload, (err, reply) => {
            expect(err).to.be.null;
            expect(reply).to.be.equal("fake_token_replyed_by_redis");
            expect(expireStub.calledOnce).to.have.be.equal(true);
            done();
        });
    })
});