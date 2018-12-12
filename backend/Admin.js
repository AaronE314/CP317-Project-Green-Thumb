"use strict";

const Ban = require("./Ban.js");
const User = require("./User.js");

/**
 * @desc The Admin class
 * @author Saje Bailey
 */
class Admin extends User {
    /**
     * @desc Constructor for the Admin class.
     * @author Saje Bailey
     * @param {Ban[]=} bans The list of Bans issued by Admin.
     * @param {String} id The ID of the Admin.
     * @constructor
     */
    constructor(id, bans) {
        super(id, bans);

        this.nextBanExpirationDate = nextBanExpirationDate;
        this.isBanned = isBanned;

        /**
        * @author Nathaniel Carr
        * @returns {Date} Next Ban expiration date.
        */
        function nextBanExpirationDate() {
            return new Date();
        }

        /**
         * @author Saje Bailey
         * @returns {Boolean} false always.
         */
        function isBanned() {
            return false;
        }
    }
}

module.exports = Admin;
