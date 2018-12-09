"use strict";
const assert = require("assert");
const Ban = require("../../backend/Ban");

describe("Ban Tests", () => {

    it("getId() should return the banId",
        /**
         * @author Noah Nichols
         */
        () => {
            let ban = new Ban(1, 2, new Date(0),21);
            assert.equal(ban.getId(), 21);
        });

    it("getUserId() should return the userId of the banned User",
        /**
         * @author Noah Nichols
         */
        () => {
            let ban = new Ban(1, 2, new Date(0),21);
            assert.equal(ban.getUserId(), 1);
        });

    it("getAdminId() should return the adminId of the Admin who banned the User",
        /**
         * @author Noah Nichols
         */
        () => {
            let ban = new Ban(1, 2, new Date(0),21);
            assert.equal(ban.getAdminId(), 2);
        });

    it("getExpirationDate() should return the date when the Ban expires",
        /**
         * @author Noah Nichols
         */
        () => {
            let ban = new Ban(1, 2, new Date(0),21);
            assert(!(ban.getExpirationtDate < new Date(0)) && !(ban.getExpirationDate > new Date(0)));
        });

    it("toJSON() should produce an object containing a copy of the attributes of the Ban object",
        /**
         * @author Noah Nichols
         */
        () => {
            let ban = new Ban(1, 2, new Date(0),21);
            let toJSON = ban.toJSON();
            assert.notDeepStrictEqual(ban, toJSON);
            assert.equal(toJSON.id, 21);
            assert.equal(toJSON.userId, 1);
            assert.equal(toJSON.adminId, 2);
            assert(!(toJSON.reportDate < new Date(0)) && !(toJSON.reportDate > new Date(0)));
        });
});