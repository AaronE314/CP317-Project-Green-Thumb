"use strict";
const assert = require("assert");
const User = require("../../backend/User");

describe("User Tests", () => {
      it("getBans() should return the private list of bans attribute.",
        /**
         * @author Adam Cassidy
         */
        () => {
            let ban = new Ban(1, 2, new Date(0),9);
            let banList = new Ban[ban];
            let user = new User(32,banList);
            assert.equals(user.getBans(), banList);
      });
      it("getId() should return the private id attribute.",
        /**
         * @author Adam Cassidy
         */
        () => {
            let user = new User(32,banList);
            assert.equals(user.getId(), 32);
      });
      it("isBanned() should return a boolean that's true if the User's banned.",
        /**
         * @author Adam Cassidy
         */
        () => {
            let ban = new Ban(1, 2, new Date(0),9);
            let banList = new Ban[ban];
            let user = new User(32,banList);
            assert.equals(user.isBanned(), true);
            let secondUser = new User(43,Ban[]);
            assert.equals(user.isBanned(), false);
      });
      it("nextBanExpirationDate() should return a date.",
        /**
         * @author Adam Cassidy
         */
        () => {
            let ban = new Ban(1, 2, new Date(0),9);
            let banList = new Ban[ban];
            let user = new User(32,banList);
            assert.equals(user.nextBanExpirationDate(), Date);
      });
      it("toJSON() should produce an object containing a copy of the attributes of the User object",
        /**
         * @author Adam Cassidy
         */
        () => {
            let ban = new Ban(1, 2, new Date(0),9);
            let banList = new Ban[ban];
            let user = new User(32,banList);
            let toJSON = user.toJSON();
            assert.notDeepStrictEqual(user, toJSON);
            assert.equal(toJSON.id, 32);
            assert.equal(toJSON.bans, banList);
            assert(!(toJSON.reportDate < new Date(0)) && !(toJSON.reportDate > new Date(0)));
});
  
});
