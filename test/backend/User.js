"use strict";
const assert = require("assert");
const User = require("../../backend/User");
const Ban = require("../../backend/Ban");

describe("User Tests", () => {
    it("getBans() should return the private list of bans attribute.",
        /**
         * @author Adam Cassidy
         */
        () => {
            let user = new User(32, [new Ban(1, 2, new Date(0), 9)]);
            assert.equal(JSON.stringify(user.getBans()), JSON.stringify([new Ban(1, 2, new Date(0), 9)]));
        });
    it("getId() should return the private id attribute.",
        /**
         * @author Adam Cassidy
         */
        () => {
            let user = new User(32, [new Ban(1, 2, new Date(0), 9)]);
            assert.equal(user.getId(), 32);
        });
    it("isBanned() should return a boolean that's true if the User's banned.",
        /**
         * @author Adam Cassidy
         */
        () => {
            let user = new User(32, [new Ban(1, 2, new Date(new Date().getTime() + 10000), 9)]);
            assert(user.isBanned());
        });
    it("nextBanExpirationDate() should return a date.",
        /**
         * @author Adam Cassidy
         */
        () => {
            let user = new User(32, [new Ban(1, 2, new Date(0), 9)]);
            assert(user.nextBanExpirationDate() instanceof Date);
        });
    it("toJSON() should produce an object containing a copy of the attributes of the User object",
        /**
         * @author Adam Cassidy
         */
        () => {
            let user = new User(32, [new Ban(1, 2, new Date(0), 9)]);
            let toJSON = user.toJSON();
            assert.notDeepStrictEqual(user, toJSON);
            assert.equal(toJSON.id, 32);
            assert(!(toJSON.reportDate < new Date(0)) && !(toJSON.reportDate > new Date(0)));
        });

});
