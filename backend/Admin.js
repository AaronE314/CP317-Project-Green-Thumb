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
     * @param {Ban[]} bans The list of Bans issued by Admin.
     * @param {Number} userId The ID of the Admin. Integer.
     * @constructor
     */
    constructor(userId, bans) {
        super(userId, bans);

        this.addBan = addBan;
        this.ban = ban;
        this.isBanned = isBanned;

        /**
         * @author Saje Bailey
         * @returns {Ban[]} The list of Bans issued by Admin.
         */
        function addBan(userId, expiration) {
            this._bans[this._bans.length] = new Ban(userId, expiration);
        }

        /**
         * @author Saje Bailey
         * @param {Number} adminId The ID of the Admin banning the User. Integer.
         * @throws exception, an Admin cannot be banned
         */
        function ban(adminId) {
            throw "An Admin cannot be banned.";
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
