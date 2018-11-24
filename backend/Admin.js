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
     * @param {Number} adminId The ID of the Admin. Integer.
     * @constructor
     */
    constructor(id, bans) {
        super(id, bans);
        
        this.getNextExpiration = getNextExpiration;
        this.isBanned = isBanned;

        /**
         * @author Saje Bailey
         * @throws exception, an Admin cannot be banned
         */
        function getNextExpiration() {
            throw "Cannot calculate Ban expiration for an Admin.";
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
