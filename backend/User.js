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
    constructor(id, bans) {
        // PROTECTED attributes.
        this._id = id;
        this._bans = (bans === undefined ? [] : bans);

        // PUBLIC methods.
        this.getBans = getBans;
        this.getId = getId;
	this.getNextExpiration = getNextExpiraion;
        this.isBanned = isBanned;
        this.toJSON = toJSON;

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
         * @returns {Date} The date that the next ban on this User will expire based on toda's date and number of previous bans.
         */
        function getNextExpiration() {
            let expiration = new Date();
            expiration.setDate(expiration.getDate() + Math.pow(BAN_BASE, (this._bans.length)));

            return expiration;
        }
        /**
         * @author Saje Bailey
         * @author Nathaniel Carr
         * @returns {Boolean} true if the User is currently banned.
         */
        function isBanned() {
            return (this._bans.length > 0) && (new Date().getTime() < this._bans[this._bans.length - 1].getExpirationDate().getTime());
        }
        /**
		 * @desc Convert the private attributes of User object to JSON so it can be sent via an API.
		 * @author Nathaniel Carr
		 * @returns {*} The User object's attributes.
		 */
		function toJSON() {
            let bans = [];
            for (let i = 0; i < this._bans.length; i++) {
                bans.push(this._bans[i].toJSON());
            }
			return {
                id: this._id,
                bans: bans
			}
		}
    }
}

module.exports = User;
