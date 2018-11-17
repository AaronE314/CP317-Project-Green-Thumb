"use strict";
const Ban = require("./Ban.js");
const BAN_BASE = 3;

/**
 * @desc The User class
 * @author Saje Bailey
 */
class User {
    /**
     * @desc Constructor for the User class.
     * @author Saje Bailey
     * @param {Ban[]} bans The list of Bans associated with the User.
     * @param {Number} userId The ID of the User. Integer.
     * @constructor
     */
    constructor(userId, bans) {
        // PROTECTED attributes.
        this._id = userId;
        this._bans = (bans === undefined ? [] : bans);

        // PUBLIC methods.
        this.getBans = getBans;
        this.getId = getId;
        this.ban = ban;
        this.isBanned = isBanned;

        // PUBLIC method definitions.
        /**
         * @author Saje Bailey
         * @returns {Ban[]} The list of Bans associated with the User.
         */
        function getBans() {
            return this._bans;
        }
        /**
         * @author Saje Bailey
         * @returns {Number} The ID of the User. Integer.
         */
        function getId() {
            return this._id;
        }
        /**
         * @author Saje Bailey
         * @param {Number} adminId The ID of the Admin banning the User. Integer.
         */
        function ban(adminId) {
            let expiration = new Date();
            expiration.setDate(expiration.getDate() + Math.pow(BAN_BASE, (this._bans.length)));

            // call function in the DB Interface with appropreate constructor arguments
            // this call to Ban constructor is temporary for testing
            this._bans[this._bans.length] = new Ban(Math.floor(Math.random() * 10000), this._id, adminId, expiration);
        }
        /**
         * @author Saje Bailey
         * @author Nathaniel Carr
         * @returns {Boolean} true if the User is currently banned.
         */
        function isBanned() {
            return (this._bans.length > 0) && (new Date().getTime() < new Date(this._bans[this._bans.length - 1].getExpirationDate()).getTime());
        }
    }
}

module.exports = User;