"use strict";

import Ban from './Ban.js'

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
        this.nextBanExpirationDate = nextBanExpirationDate;
        this.isBanned = isBanned;

        /**
         * @author Saje Bailey
         * @returns {Ban[]} The list of Bans issued by Admin.
         */
        function addBan(userId, expiration) {
            this._bans[this._bans.length] = new Ban(userId, expiration);
        }

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
