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
     * @param {String} id The ID of the User.
     * @constructor
     */
    constructor(id, bans) {
        // PROTECTED attributes.
        this._id = id;
        this._bans = (bans === undefined ? [] : bans);

        // PUBLIC methods.
        this.getBans = getBans;
        this.getId = getId;
        this.isBanned = isBanned;
        this.nextBanExpirationDate = nextBanExpirationDate;
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
         * @author Nathaniel Carr
         * @returns {Boolean} true if the User is currently banned.
         */
        function isBanned() {
            return (this._bans.length > 0) && (new Date().getTime() < new Date(this._bans[this._bans.length - 1].getExpirationDate()).getTime());
        }

        /**
         * @author Nathaniel Carr
         * @returns {Date} Next Ban expiration date.
         */
        function nextBanExpirationDate() {
            return new Date(new Date().getTime() + Math.pow(BAN_BASE, this._bans.length + 1)* 24 * 60 * 60 * 1000 );
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