"use strict";
const assert = require("assert");
const Admin = require("../../backend/Admin");

describe("Admin Tests", () => {

    it("nextBanExpirationDate() should return a Date.",
        /**
         * @author Adam Cassidy
         */
        () => {
            assert((new Admin("1")).nextBanExpirationDate() instanceof Date);
        });

    it("isBanned() should return false.",
        /**
         * @author Adam Cassidy
         */
        () => {
            assert.equal((new Admin("1")).isBanned(), false);
        });

    it("toJSON() should produce an object containing a copy of the attributes of the Admin object",
        /**
         * @author Adam Cassidy
         */
        () => {
            let user = new Admin("32", []);
            let toJSON = user.toJSON();
            assert.notDeepStrictEqual(user, toJSON);
            assert.equal(toJSON.id, "32");
            assert(!(toJSON.reportDate < new Date(0)) && !(toJSON.reportDate > new Date(0)));
        });
});
