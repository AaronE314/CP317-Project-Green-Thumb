"use strict";
const assert = require("assert");
const Admin = require("../../backend/Admin");

describe("Admin Tests", () => {

    it("nextBanExpirationDate() should return a date",
        /**
         * @author Adam Cassidy
         */
        () => {
            assert((new Admin(1)).nextBanExpirationDate() instanceof Date);
        });

    it("isBanned() should return false",
        /**
         * @author Adam Cassidy
         */
        () => {
            assert.equal((new Admin(1)).isBanned(), false);
        });
});
