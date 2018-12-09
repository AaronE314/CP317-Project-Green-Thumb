"use strict";
const assert = require("assert");
const Admin = require("../../backend/Admin");

describe("Admin Tests", () => {

    it("nextBanExpirationDate() should return a date",
        /**
         * @author Adam Cassidy
         */
        () => {
            let date = new Date();
            assert.equal(Admin.nextBanExpirationDate(), date);
        });

    it("isBanned() should return false",
        /**
         * @author Adam Cassidy
         */
        () => {
            assert.equal(Admin.isBanned(), false);
        });
});
